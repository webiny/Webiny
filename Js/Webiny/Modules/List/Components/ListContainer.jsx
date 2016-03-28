import Webiny from 'Webiny';
import ApiDataSource from './DataSource/Api';
import StaticDataSource from './DataSource/Static';
const Ui = Webiny.Ui.Components;

class ListContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            meta: {}
        };

        this.sorters = {};
        this.filters = {};
        this.dataSource = null;

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
            'prepareChildren',
            'prepareChild',
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
            this.perPage = params._perPage || props.page || 1;
            this.page = params._page || props.perPage || 10;

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

    tableProps(tableProps) {
        // Pass relevant props from ListContainer to Table
        _.each(this.props, (value, name) => {
            if (_.startsWith(name, 'field') && name !== 'fields' || _.startsWith(name, 'action')) {
                tableProps[name] = value;
            }
        });
        tableProps.data = this.state.list;
        tableProps.sorters = this.sorters;
        tableProps.onSort = this.setSorters;
    }

    paginationProps(paginationProps) {
        _.assign(paginationProps, {
            onPageChange: this.setPage,
            totalPages: this.dataSource.getTotalPages(),
            currentPage: this.page
        });
    }

    prepareChild(child, index) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        const props = _.clone(child.props);
        props.key = index;

        // ListContainer handles different List components: Filters, Table, Actions, MultiActions and Pagination
        switch (child.type) {
            case Ui.List.Filters:
            case Ui.List.MultiActions:
            case Ui.List.Table.Table:
                this.tableProps(props);
                break;
            case Ui.List.Pagination:
                this.paginationProps(props);
                break;
            default:
                return React.cloneElement(child, props, this.prepareChildren(props.children));
        }

        return React.cloneElement(child, props);
    }

    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    render() {
        const content = this.prepareChildren(this.props.children);
        return (
            <webiny-list-container>{content}</webiny-list-container>
        );
    }
}

ListContainer.defaultProps = {
    connectToRouter: false,
    defaultParams: {},
    page: 1,
    perPage: 10
};

export default ListContainer;