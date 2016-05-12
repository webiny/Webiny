import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class BaseContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            meta: {},
            sorters: {},
            filters: {},
            page: props.page,
            perPage: props.perPage,
            searchQuery: null,
            searchOperator: props.searchOperator || 'or',
            searchFields: props.searchFields || null,
            selectedRows: new Set()
        };

        this.filtersElement = null;
        this.tableElement = null;
        this.paginationElement = null;
        this.multiActionsElement = null;

        this.bindMethods(
            'prepareList',
            'tableProps',
            'paginationProps',
            'setSorters',
            'setFilters',
            'setPage',
            'setPerPage',
            'setSearchQuery',
            'getSearchQuery',
            'loadData',
            'prepare',
            'recordUpdate',
            'recordDelete',
            'onSelect',
            'getContent'
        );
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
    }

    loadData() {
        throw new Error('Implement loadData method in your list container class!');
    }

    prepare(props) {
        const state = {
            sorters: {},
            filters: {}
        };

        if (props.connectToRouter) {
            const params = Webiny.Router.getQueryParams();
            const urlSort = params._sort || '';
            urlSort.split(',').map(sorter => {
                if (sorter === '') {
                    return;
                }
                if (_.startsWith(sorter, '-')) {
                    state.sorters[_.trimStart(sorter, '-')] = -1;
                } else {
                    state.sorters[sorter] = 1;
                }
            });

            // Get limit and page
            state.page = params._page || props.page || 1;
            state.perPage = params._perPage || props.perPage || 10;
            state.searchQuery = params._searchQuery || null;

            // Get filters
            _.each(params, (value, name) => {
                if (!_.startsWith('_', name)) {
                    state.filters[name] = value;
                }
            });
        } else {
            state.sorters = props.sorters || {};
            state.filters = props.filters || {};
            state.page = props.page || 1;
            state.perPage = props.perPage || 10;
        }

        _.assign(this.state, state);
        this.setState(this.state);
    }

    setSorters(sorters) {
        if (this.props.connectToRouter) {
            this.goToRoute({_sort: Webiny.Router.sortersToString(sorters), _page: 1});
        } else {
            this.setState({page: 1, sorters}, this.loadData);
        }

        return this;
    }

    setFilters(filters) {
        if (this.props.connectToRouter) {
            // Need to build a new object with null values to unset filters from URL
            if (_.isEmpty(filters) && _.keys(this.state.filters)) {
                filters = _.mapValues(this.state.filters, () => null);
            }

            filters._page = 1;
            this.goToRoute(filters);
        } else {
            this.setState({page: 1, filters}, this.loadData);
        }

        return this;
    }

    setPage(page) {
        if (this.props.connectToRouter) {
            this.goToRoute({_page: page});
        } else {
            this.setState({page}, this.loadData);
        }

        return this;
    }

    setPerPage(perPage) {
        if (this.props.connectToRouter) {
            this.goToRoute({_perPage: perPage});
        } else {
            this.setState({page: 1, perPage}, this.loadData);
        }

        return this;
    }

    setSearchQuery(query) {
        if (this.props.connectToRouter) {
            this.goToRoute({_searchQuery: query});
        } else {
            this.setState({page: 1, searchQuery: query}, this.loadData);
        }

        return this;
    }

    goToRoute(params) {
        Webiny.Router.goToRoute('current', params);
    }

    getSearchQuery() {
        return this.searchQuery;
    }

    /* eslint-disable */
    recordUpdate(id, attributes) {
        throw new Error('Implement recordUpdate method in your list container class!');
    }

    recordDelete(id) {
        throw new Error('Implement recordDelete method in your list container class!');
    }

    /* eslint-enable */

    onSelect(data) {
        this.setState({selectedRows: data});
    }

    getContainerActions() {
        return {
            reload: this.loadData,
            update: this.recordUpdate,
            delete: this.recordDelete
        };
    }

    tableProps(tableProps) {
        // Pass relevant props from BaseContainer to Table
        _.each(this.props, (value, name) => {
            if (_.startsWith(name, 'field') && name !== 'fields' || _.startsWith(name, 'action')) {
                tableProps[name] = value;
            }
        });
        _.assign(tableProps, {
            data: _.clone(this.state.list),
            sorters: this.state.sorters,
            onSort: this.setSorters,
            actions: this.getContainerActions(),
            selectedRows: this.state.selectedRows
        });

        return tableProps;
    }

    paginationProps(paginationProps) {
        _.assign(paginationProps, {
            onPageChange: this.setPage,
            currentPage: this.state.page,
            perPage: this.state.perPage,
            count: _.get(this.state.list, 'length', 0),
            totalCount: _.get(this.state.meta, 'totalCount', 0),
            totalPages: _.get(this.state.meta, 'totalPages', 0)
        });

        return paginationProps;
    }

    multiActionsProps(multiActionsProps) {
        _.assign(multiActionsProps, {
            data: this.state.selectedRows,
            actions: this.getContainerActions()
        });

        return multiActionsProps;
    }

    /**
     * @private
     * @param children
     */
    prepareList(children) {
        if (typeof children !== 'object' || children === null) {
            return;
        }

        React.Children.map(children, child => {
            if (child.type === Ui.List.Filters || child.type.prototype instanceof Ui.List.Filters) {
                this.filtersElement = React.cloneElement(child, {
                    filters: this.state.filters,
                    onFilter: this.setFilters
                });
            }

            const props = _.omit(child.props, ['children', 'key', 'ref']);
            if (child.type === Ui.List.Table.Table) {
                this.tableElement = React.cloneElement(child, this.tableProps(props), child.props.children);
            }

            if (child.type === Ui.List.Pagination) {
                this.paginationElement = React.cloneElement(child, this.paginationProps(props), child.props.children);
            }
            if (child.type === Ui.List.MultiActions) {
                this.multiActionsElement = React.cloneElement(child, this.multiActionsProps(props), child.props.children);
            }
        }, this);

        // If MultiActions are present, pass an onSelect callback to Table which will tell Table to allow selection
        // and execute onSelect callback when selection is changed
        if (this.multiActionsElement) {
            this.tableElement = React.cloneElement(this.tableElement, {onSelect: this.onSelect});
        }
    }

    /**
     * @private
     * @param element
     * @returns {*}
     */
    replacePlaceholders(element) {
        if (typeof element !== 'object' || element === null) {
            return element;
        }

        if (element.type === 'filters' && this.filtersElement) {
            return this.filtersElement;
        }

        if (element.type === 'table') {
            return this.tableElement;
        }

        if (element.type === 'pagination') {
            return this.paginationElement;
        }

        if (element.type === 'multi-actions') {
            return this.multiActionsElement;
        }

        if (element.props && element.props.children) {
            return React.cloneElement(element, _.omit(element.props, ['key', 'ref']), React.Children.map(element.props.children, item => {
                return this.replacePlaceholders(item);
            }));
        }

        return element;
    }

    /**
     * Get ApiContainer content
     * @param params Optional params to pass to content render function
     * @returns {*}
     */
    getContent(...params) {
        const children = this.props.children;
        if (_.isFunction(children)) {
            if (params.length === 0) {
                params = [this, this.state.list, this];
            } else {
                params.unshift(this);
                params.push(this);
            }
            const content = children.call(...params);
            if (_.isArray(content)) {
                return content;
            }
            return content.props.children;
        }

        return React.Children.toArray(children);
    }
}

BaseContainer.defaultProps = {
    connectToRouter: false,
    defaultParams: {},
    page: 1,
    perPage: 10,
    layout: function layout() {
        return (
            <div className="col-xs-12">
                <filters/>
                <table/>
                <pagination/>
            </div>
        );
    },
    renderer() {
        this.prepareList(this.getContent());

        const layout = this.props.layout.call(this);

        if (React.Children.toArray(layout.props.children).length) {
            const render = [];
            React.Children.map(layout, (item, index) => {
                render.push(React.cloneElement(this.replacePlaceholders(item), {key: index}));
            });
            return <webiny-list>{render}</webiny-list>;
        }

        const layoutProps = {
            filters: this.filtersElement,
            table: this.tableElement,
            pagination: this.paginationElement,
            multiActions: this.multiActionsElement,
            container: this
        };

        return React.cloneElement(layout, layoutProps);
    }
};

export default BaseContainer;