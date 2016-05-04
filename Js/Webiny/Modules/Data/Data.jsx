import Webiny from 'Webiny';

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
        this.request = this.api.execute().then(this.setData);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.abort();
        }
    }

    setData(apiResponse) {
        if (apiResponse.isAborted()) {
            return;
        }

        if (apiResponse.isError()) {
            return Webiny.Growl.info(apiResponse.getError(), 'Could not fetch data');
        }
        this.setState({data: apiResponse.getData()});
    }

    filter(filters = {}) {
        this.request = this.api.setQuery(filters).execute().then(this.setData);
    }
}

Data.defaultProps = {
    waitForData: true,
    renderer() {
        if (this.props.waitForData && !this.state.data) {
            return null;
        }

        return _.isFunction(this.props.children) ? this.props.children(this.state.data, this.filter) : null;
    }
};

export default Data;