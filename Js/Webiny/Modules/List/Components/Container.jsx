import Webiny from 'Webiny';
import ApiDataSource from './DataSource/Api';
import StaticDataSource from './DataSource/Static';
const Ui = Webiny.Ui.Components;

class Container extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            meta: {}
        };

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
            'loadData',
            'prepare'
        );
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepare(this.props);
        this.loadData();
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(props);
        this.loadData();
    }

    loadData() {
        this.dataSource.setSorters(this.sorters).setFilters(this.filters).setPage(this.page).setPerPage(this.perPage);
        this.dataSource.setSearchQuery(this.searchQuery).setSearchFields(this.searchFields).setSearchOperator(this.searchOperator);

        return this.dataSource.getData().then(data => {
            return this.setState(data);
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
            Webiny.Router.goToRoute('current', {_sort: Webiny.Router.sortersToString(sorters), _page: 1});
        } else {
            this.page = 1;
            this.sorters = sorters;
            this.loadData();
        }

        return this;
    }

    setFilters(filters) {
        if (this.props.connectToRouter) {
            filters._page = 1;
            Webiny.Router.goToRoute('current', filters);
        } else {
            this.page = 1;
            this.filters = filters;
            this.loadData();
        }

        return this;
    }

    setPage(page) {
        if (this.props.connectToRouter) {
            Webiny.Router.goToRoute('current', {_page: page});
        } else {
            this.page = page;
            this.loadData();
        }

        return this;
    }

    setPerPage(perPage) {
        if (this.props.connectToRouter) {
            Webiny.Router.goToRoute('current', {_perPage: perPage});
        } else {
            this.page = 1;
            this.perPage = perPage;
            this.loadData();
        }

        return this;
    }

    setSearchQuery(query) {
        if (this.props.connectToRouter) {
            Webiny.Router.goToRoute('current', {_searchQuery: query});
        } else {
            this.page = 1;
            this.searchQuery = query;
            this.loadData();
        }

        return this;
    }

    tableProps(tableProps) {
        // Pass relevant props from Container to Table
        _.each(this.props, (value, name) => {
            if (_.startsWith(name, 'field') && name !== 'fields' || _.startsWith(name, 'action')) {
                tableProps[name] = value;
            }
        });
        tableProps.data = this.state.list;
        tableProps.sorters = this.sorters;
        tableProps.onSort = this.setSorters;

        return tableProps;
    }

    paginationProps(paginationProps) {
        _.assign(paginationProps, {
            onPageChange: this.setPage,
            totalPages: this.dataSource.getTotalPages(),
            currentPage: this.page,
            perPage: this.perPage,
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
            if (child.type === Ui.List.Filters) {
                this.filtersElement = child;
            }

            if (child.type === Ui.List.Table.Table) {
                this.tableElement = React.cloneElement(child, this.tableProps(_.clone(child.props)));
            }

            if (child.type === Ui.List.Pagination) {
                this.paginationElement = React.cloneElement(child, this.paginationProps(_.clone(child.props)));
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

        if (element.type === 'filters') {
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
    layout: function () {
        return (
            <Ui.Panel.Panel>
                <Ui.Panel.Header title="Generic list title">
                    <div className="pull-right" style={{marginTop: '-10px'}}>
                        <filters/>
                    </div>
                </Ui.Panel.Header>
                <Ui.Panel.Body>
                    <table/>
                    <pagination/>
                </Ui.Panel.Body>
            </Ui.Panel.Panel>
        );
    },
    renderer: function renderer() {
        this.prepareList(this.props.children);

        if (_.isFunction(this.props.layout)) {
            const layout = this.props.layout.bind(this)();
            const render = [];
            React.Children.map(layout, (item, index) => {
                render.push(React.cloneElement(this.replacePlaceholders(item), {key: index}));
            });
            return <webiny-list>{render}</webiny-list>;
        } else if (React.isValidElement(this.props.layout)) {
            const layoutProps = {
                filters: this.filtersElement,
                table: this.tableElement,
                pagination: this.paginationElement,
                container: this
            };
            return React.cloneElement(this.props.layout, layoutProps);
        }

        return null;
    }
};

export default Container;