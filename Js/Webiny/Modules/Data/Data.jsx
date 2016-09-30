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
    }

    componentDidMount() {
        super.componentDidMount();
        this.request = this.api.execute().then(apiResponse => {
            this.setData(apiResponse);
            return apiResponse.getData();
        });
        return this.request;
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

        this.setState({loading: false});

        if (apiResponse.isError()) {
            Webiny.Growl.info(apiResponse.getError(), 'Could not fetch data', true);
            return;
        }
        this.setState({data: apiResponse.getData()});
    }

    filter(filters = {}) {
        this.setState({loading: true});
        this.request = this.api.setQuery(filters).execute().then(this.setData);
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