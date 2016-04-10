import Webiny from 'Webiny';
import BaseContainer from './BaseContainer';
const Ui = Webiny.Ui.Components;

class ApiContainer extends BaseContainer {

    constructor(props){
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

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.prepare(_.clone(props));
        if (this.props.autoLoad) {
            this.loadData();
        }
    }

    loadData() {
        const params = _.assign({}, this.filters, {
            _sort: Webiny.Router.sortersToString(this.sorters),
            _perPage: this.perPage,
            _page: this.page,
            _searchQuery: this.searchQuery,
            _searchFields: this.searchFields,
            _searchOperator: this.searchOperator
        });

        return this.api.execute(null, null, null, _.assign({}, this.api.params, params)).then(apiResponse => {
            let data = null;
            if (!apiResponse.isError()) {
                data = apiResponse.getData();
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

ApiContainer.defaultProps = {
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

export default ApiContainer;