import Webiny from 'Webiny';
import BaseContainer from './BaseContainer';

class ApiContainer extends BaseContainer {

    constructor(props) {
        super(props);

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
        if (this.request) {
            this.request.abort();
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(_.clone(props));
        // TODO: think of a way to improve this check (maybe limit it only to API related props?)
        if (this.props.autoLoad && !_.isEqual(_.omit(props, ['children']), _.omit(this.props, ['children']))) {
            this.loadData();
        }
    }

    loadData() {
        const selectedRows = this.state.selectedRows;
        selectedRows.clear();
        this.setState({selectedRows});
        const query = _.assign({}, this.state.filters, {
            _sort: Webiny.Router.sortersToString(this.state.sorters),
            _perPage: this.state.perPage,
            _page: this.state.page,
            _searchQuery: this.state.searchQuery,
            _searchFields: this.state.searchFields,
            _searchOperator: this.state.searchOperator
        });

        this.request = this.api.setQuery(query).execute().then(apiResponse => {
            let data = null;
            if (!apiResponse.isError() && !apiResponse.isAborted()) {
                data = apiResponse.getData();
                if (this.props.prepareLoadedData) {
                    data.list = this.props.prepareLoadedData(data.list);
                }
                this.setState(data);
            }

            return data;
        });

        return this.request;
    }

    getContainerActions() {
        const actions = super.getContainerActions();
        actions.api = this.api;
        return actions;
    }

    recordUpdate(id, attributes) {
        return this.api.patch(id, attributes).then(this.loadData);
    }

    recordDelete(id) {
        return this.api.delete(id).then(apiResponse => {
            if (!apiResponse.isError()) {
                this.loadData();
            }
            return apiResponse;
        });
    }
}

ApiContainer.defaultProps = _.merge({}, BaseContainer.defaultProps, {
    autoLoad: true,
    autoRefresh: null,
    prepareLoadedData: null
});

export default ApiContainer;