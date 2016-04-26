import Webiny from 'Webiny';
import BaseContainer from './BaseContainer';

class ApiContainer extends BaseContainer {

    constructor(props) {
        super(props);
        this.bindMethods('onRecordExecute');

        Webiny.Mixins.ApiComponent.extend(this);
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepare(_.clone(this.props));
        if (this.props.autoLoad) {
            this.loadData();
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.autoRefresh && _.isNumber(this.props.autoRefresh)) {
            this.autoRefresh = setInterval(this.loadData, 1000 * this.props.autoRefresh);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.autoRefresh);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(_.clone(props));
        if (this.props.autoLoad) {
            this.loadData();
        }
    }

    loadData() {
        const selectedData = this.state.selectedData;
        selectedData.clear();
        this.setState({selectedData});
        const query = _.assign({}, this.filters, {
            _sort: Webiny.Router.sortersToString(this.sorters),
            _perPage: this.perPage,
            _page: this.page,
            _searchQuery: this.searchQuery,
            _searchFields: this.searchFields,
            _searchOperator: this.searchOperator
        });

        return this.api.execute(null, null, null, _.assign({}, this.api.query, query)).then(apiResponse => {
            let data = null;
            if (!apiResponse.isError()) {
                data = apiResponse.getData();
                if (this.props.prepareLoadedData) {
                    data.list = this.props.prepareLoadedData(data.list);
                }
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
            }

            return data;
        });
    }

    onRecordUpdate(id, attributes) {
        return this.api.patch(id, attributes).then(this.loadData);
    }

    onRecordDelete(id) {
        return this.api.delete(id).then(this.loadData);
    }

    onRecordExecute(httpMethod, method, body, query) {
        return this.api.execute(httpMethod, method, body, query);
    }
}

ApiContainer.defaultProps = _.merge({}, BaseContainer.defaultProps, {
    autoLoad: true,
    autoRefresh: null,
    prepareLoadedData: null
});

export default ApiContainer;