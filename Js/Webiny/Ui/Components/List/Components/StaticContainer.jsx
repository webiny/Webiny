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
        const propsData = _.get(props, 'data', this.props.data);
        let data = _.isEmpty(this.state.filters) ? propsData : _.filter(propsData, this.state.filters);
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
            searchFields: this.state.searchFields,
            selectedRows: []
        });
    }
}

StaticContainer.defaultProps = _.merge({}, BaseContainer.defaultProps, {
    connectToRouter: false,
    page: 1,
    perPage: 10,
    layout() {
        return (
            <webiny-list-layout>
                <filters/>
                <table/>
                <pagination/>
            </webiny-list-layout>
        );
    }
});

export default StaticContainer;