import Webiny from 'Webiny';
import ApiDataSource from './DataSource/Api';
import StaticDataSource from './DataSource/Static';
import updateAction from './Actions/Update';
import deleteAction from './Actions/Delete';
import executeAction from './Actions/Execute';
const Ui = Webiny.Ui.Components;

class Container extends Webiny.Ui.Component {

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
            searchFields: props.searchFields || null
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

        this.dataSource = null;

        this.filtersElement = null;
        this.tableElement = null;
        this.paginationElement = null;

        if (props.api) {
            this.dataSource = new ApiDataSource(props.api, props.defaultParams);
            if (props.fields) {
                this.dataSource.setFields(props.fields);
            }
        }

        if (props.data) {
            this.dataSource = new StaticDataSource(props.data, props.defaultParams);
        }

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
            'onRecordExecute'
        );
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepare(_.clone(this.props));
        if (this.props.autoLoad) {
            this.loadData();
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(_.clone(props));
        if (this.props.autoLoad) {
            this.loadData();
        }
    }

    loadData() {
        this.dataSource.setSorters(this.sorters).setFilters(this.filters).setPage(this.page).setPerPage(this.perPage);
        this.dataSource.setSearchQuery(this.searchQuery).setSearchFields(this.searchFields).setSearchOperator(this.searchOperator);

        return this.dataSource.getData().then(data => {
            this.setState({
                list: data.list,
                meta: data.meta,
                sorters: this.sorters,
                filters: this.filters,
                page: this.page,
                perPage: this.perPage,
                searchQuery: this.searchQuery,
                searchOperator: this.searchOperator,
                searchFields: this.searchFields
            });
            return data;
        });
    }

    prepare(props) {
        this.sorters = {};
        this.filters = {};

        if (props.connectToRouter) {
            const params = Webiny.Router.getParams();
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
            if(_.isEmpty(filters) && _.keys(this.filters)){
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

    onRecordUpdate(id, attributes) {
        return this.dataSource.update(id, attributes).then(this.loadData);
    }

    onRecordDelete(id) {
        return this.dataSource.delete(id).then(this.loadData);
    }

    onRecordExecute(httpMethod, method, body, query) {
        return this.dataSource.execute(httpMethod, method, body, query);
    }

    tableProps(tableProps) {
        // Pass relevant props from Container to Table
        _.each(this.props, (value, name) => {
            if (_.startsWith(name, 'field') && name !== 'fields' || _.startsWith(name, 'action')) {
                tableProps[name] = value;
            }
        });
        _.assign(tableProps, {
            data: this.state.list,
            sorters: this.state.sorters,
            onSort: this.setSorters,
            actions: {
                update: updateAction(this.onRecordUpdate), //(id, data) => () => this.onRecordUpdate(id, data),
                delete: deleteAction(this.onRecordDelete),
                execute: executeAction(this.onRecordExecute)
            }

        });

        return tableProps;
    }

    paginationProps(paginationProps) {
        _.assign(paginationProps, {
            onPageChange: this.setPage,
            totalPages: this.dataSource.getTotalPages(),
            currentPage: this.state.page,
            perPage: this.state.perPage,
            count: this.state.list.length,
            totalCount: this.state.meta.totalCount
        });

        return paginationProps;
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

            const props = _.omit(child.props, ['children']);
            if (child.type === Ui.List.Table.Table) {
                this.tableElement = React.cloneElement(child, this.tableProps(props), child.props.children);
            }

            if (child.type === Ui.List.Pagination) {
                this.paginationElement = React.cloneElement(child, this.paginationProps(props), child.props.children);
            }
        }, this);
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

        if (element.props && element.props.children) {
            return React.cloneElement(element, element.props, React.Children.map(element.props.children, item => {
                return this.replacePlaceholders(item);
            }));
        }

        return element;
    }
}

Container.defaultProps = {
    connectToRouter: false,
    defaultParams: {},
    page: 1,
    perPage: 10,
    autoLoad: true,
    layout: function () {
        return (
            <div className="col-xs-12">
                <filters/>
                <table/>
                <pagination/>
            </div>
        );
    },
    renderer: function renderer() {
        this.prepareList(this.props.children);

        const layout = this.props.layout.bind(this)();

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
            container: this
        };
        return React.cloneElement(layout, layoutProps);
    }
};

export default Container;