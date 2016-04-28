import Webiny from 'Webiny';
import updateAction from './Actions/Update';
import deleteAction from './Actions/Delete';
import executeAction from './Actions/Execute';
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

        // Temporary properties used for loading data
        // When data is finished loading, they are assigned to state
        this.sorters = {};
        this.filters = {};
        this.page = props.page;
        this.perPage = props.perPage;
        this.searchQuery = null;
        this.searchOperator = props.searchOperator || 'or';
        this.searchFields = props.searchFields || null;

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
            'onRecordUpdate',
            'onRecordDelete',
            'onSelect'
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
        this.sorters = {};
        this.filters = {};

        if (props.connectToRouter) {
            const params = Webiny.Router.getQueryParams();
            const urlSort = params._sort || '';
            urlSort.split(',').map(sorter => {
                if (sorter === '') {
                    return;
                }
                if (_.startsWith(sorter, '-')) {
                    this.sorters[_.trimStart(sorter, '-')] = -1;
                } else {
                    this.sorters[sorter] = 1;
                }
            });

            // Get limit and page
            this.page = params._page || props.page || 1;
            this.perPage = params._perPage || props.perPage || 10;
            this.searchQuery = params._searchQuery || null;

            // Get filters
            _.each(params, (value, name) => {
                if (!_.startsWith('_', name)) {
                    this.filters[name] = value;
                }
            });
        } else {
            this.sorters = props.sorters || {};
            this.filters = props.filters || {};
            this.page = props.page || 1;
            this.perPage = props.perPage || 10;
        }
    }

    setSorters(sorters) {
        if (this.props.connectToRouter) {
            this.goToRoute({_sort: Webiny.Router.sortersToString(sorters), _page: 1});
        } else {
            this.page = 1;
            this.sorters = sorters;
            this.loadData();
        }

        return this;
    }

    setFilters(filters) {
        if (this.props.connectToRouter) {
            // Need to build a new object with null values to unset filters from URL
            if (_.isEmpty(filters) && _.keys(this.filters)) {
                filters = _.mapValues(this.filters, () => null);
            }

            filters._page = 1;
            this.goToRoute(filters);
        } else {
            this.page = 1;
            this.filters = filters;
            this.loadData();
        }

        return this;
    }

    setPage(page) {
        if (this.props.connectToRouter) {
            this.goToRoute({_page: page});
        } else {
            this.page = page;
            this.loadData();
        }

        return this;
    }

    setPerPage(perPage) {
        if (this.props.connectToRouter) {
            this.goToRoute({_perPage: perPage});
        } else {
            this.page = 1;
            this.perPage = perPage;
            this.loadData();
        }

        return this;
    }

    setSearchQuery(query) {
        if (this.props.connectToRouter) {
            this.goToRoute({_searchQuery: query});
        } else {
            this.page = 1;
            this.searchQuery = query;
            this.loadData();
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
    onRecordUpdate(id, attributes) {
        throw new Error('Implement onRecordUpdate method in your list container class!');
    }

    onRecordDelete(id) {
        throw new Error('Implement onRecordDelete method in your list container class!');
    }

    onSelect(data) {
        this.setState({selectedRows: data})
    }

    getContainerActions() {
        return {
            reload: () => this.loadData(),
            update: updateAction(this.onRecordUpdate), // (id, data) => () => this.onRecordUpdate(id, data),
            delete: deleteAction(this.onRecordDelete),
            execute: executeAction(this.onRecordExecute)
        };
    }

    /* eslint-enable */

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
            this.tableElement = React.cloneElement(this.tableElement, {onSelect: this.onSelect})
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
                params = [this, this.state.model, this];
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
        return children;
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