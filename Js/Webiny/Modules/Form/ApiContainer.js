import Webiny from 'Webiny';
import BaseContainer from './BaseContainer';

class ApiContainer extends BaseContainer {

    constructor(props) {
        super(props);
        Webiny.Mixins.ApiComponent.extend(this);
    }

    componentWillMount() {
        super.componentWillMount();

        if (this.props.loadData) {
            return this.props.loadData.call(this).then(data => {
                this.setState({model: data, loading: false});
            });
        }

        this.loadData(this.props.id);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.abort();
        }
    }

    showLoading() {
        this.setState({loading: true});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    isLoading() {
        return this.state.loading;
    }

    loadData(id = null) {
        if (!id) {
            if (this.props.connectToRouter) {
                id = Webiny.Router.getParams('id');
            }
        }

        if (id) {
            this.showLoading();
            return this.request = this.api.execute(this.api.httpMethod, id).then(apiResponse => {
                if (apiResponse.isAborted()) {
                    return;
                }
                if (this.props.prepareLoadedData) {
                    return this.setState({model: this.props.prepareLoadedData(apiResponse.getData()), loading: false});
                }
                this.setState({model: apiResponse.getData(), loading: false});
            });
        }
    }

    onSubmit(data) {
        this.showLoading();
        if (data.id) {
            return this.api.patch(data.id, data).then(apiResponse => {
                this.hideLoading();
                const onSubmitSuccess = this.props.onSubmitSuccess;
                if (!apiResponse.isError() && onSubmitSuccess) {
                    if (_.isFunction(onSubmitSuccess)) {
                        return onSubmitSuccess.bind(this)(apiResponse);
                    }

                    if (_.isString(onSubmitSuccess)) {
                        Webiny.Router.goToRoute(onSubmitSuccess);
                    }
                }
                return apiResponse;
            });
        }

        return this.api.post('/', data).then(apiResponse => {
            this.hideLoading();
            const onSubmitSuccess = this.props.onSubmitSuccess;
            if (!apiResponse.isError() && onSubmitSuccess) {
                if (_.isFunction(onSubmitSuccess)) {
                    return onSubmitSuccess.bind(this)(apiResponse);
                }

                if (_.isString(onSubmitSuccess)) {
                    Webiny.Router.goToRoute(onSubmitSuccess);
                }
            }
            return apiResponse;
        });
    }
}

ApiContainer.defaultProps = _.assign({}, BaseContainer.defaultProps, {
    connectToRouter: false
});

export default ApiContainer;