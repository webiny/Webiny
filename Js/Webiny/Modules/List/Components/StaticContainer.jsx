import BaseContainer from './BaseContainer';

class StaticContainer extends BaseContainer {

    componentWillMount() {
        super.componentWillMount();
        this.prepare(this.props);
        this.loadData(this.props);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(props);
        this.loadData(props);
    }

    loadData(props) {
        let data = _.isEmpty(this.state.filters) ? props.data : _.filter(props.data, this.state.filters);
        const fields = [];
        const order = [];
        _.each(this.state.sorters, (sort, field) => {
            fields.push(field);
            order.push(sort === 1 ? 'asc' : 'desc');
        });
        data = _.orderBy(data, fields, order);


        const meta = {
            currentPage: this.state.page,
            perPage: this.state.perPage,
            totalCount: data.length,
            totalPages: Math.ceil(data.length / this.state.perPage)
        };

        this.totalPages = meta.totalPages;

        const from = (this.state.page - 1) * this.state.perPage;

        this.setState({
            list: data.slice(from, from + this.state.perPage),
            meta,
            sorters: this.state.sorters,
            filters: this.state.filters,
            page: this.state.page,
            perPage: this.state.perPage,
            searchQuery: this.state.searchQuery,
            searchOperator: this.state.searchOperator,
            searchFields: this.state.searchFields
        });
    }

    recordUpdate(id, attributes) {
        return this.api.patch(id, attributes).then(this.loadData);
    }

    recordDelete(id) {
        return this.api.delete(id).then(this.loadData);
    }
}

StaticContainer.defaultProps = {
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

export default StaticContainer;