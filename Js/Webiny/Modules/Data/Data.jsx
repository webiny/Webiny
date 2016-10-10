import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Data extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null
        };

        this.bindMethods('setData,filter');
        Webiny.Mixins.ApiComponent.extend(this);
    }

    componentWillMount() {
        super.componentWillMount();
        if (!_.isFunction(this.props.children)) {
            console.warn('Warning: Data component only accepts a function as its child element!');
        }
        this.setState({loading: true});
    }

    componentDidMount() {
        super.componentDidMount();
        this.request = this.api.execute().then(apiResponse => {
            this.setData(apiResponse);
            return apiResponse.getData();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.abort();
        }
    }

    setData(apiResponse) {
        if (apiResponse.isAborted() || !this.isMounted()) {
            return;
        }

        if (apiResponse.isError()) {
            this.setState({loading: false});
            Webiny.Growl.info(apiResponse.getError(), 'Could not fetch data', true);
            return;
        }
        this.setState({data: apiResponse.getData(), loading: false});
    }

    filter(filters = {}) {
        this.setState({loading: true});
        this.request = this.api.setQuery(filters).execute().then(this.setData);
        return this.request;
    }
}

Data.defaultProps = {
    waitForData: true,
    renderer() {
        if (this.props.waitForData && !this.state.data) {
            return null;
        }

        const loader = this.state.loading ? <Ui.Loader/> : null;

        return (
            <webiny-data>
                {_.isFunction(this.props.children) ? this.props.children.call(this, this.state.data, this.filter, loader, this) : null}
            </webiny-data>
        );
    }
};

export default Data;