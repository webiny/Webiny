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
                this.setState({model: data});
            });
        }

        this.loadData();
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
    }

    loadData(id = null) {
        if (!id) {
            if (this.props.connectToRouter) {
                id = Webiny.Router.getParams('id');
            }
        }

        if (id) {
            return this.api.execute(this.api.httpMethod, id).then(apiResponse => {
                this.setState({model: apiResponse.getData()});
            });
        }
    }

    onSubmit(model) {
        console.log('Form Container [ON SUBMIT]', model);
        this.setState({model: _.assign({}, this.state.model, model)}, () => {
            if (Webiny.Router.getParams('id')) {
                return this.api.execute('PATCH', this.state.model.id, this.state.model).then(ar => {
                    const onSubmitSuccess = this.props.onSubmitSuccess;
                    if (!ar.isError() && onSubmitSuccess) {
                        if (_.isFunction(onSubmitSuccess)) {
                            return onSubmitSuccess.bind(this)(ar);
                        }

                        if (_.isString(onSubmitSuccess)) {
                            Webiny.Router.goToRoute(onSubmitSuccess);
                        }
                    }
                });
            }

            this.api.execute('POST', '/', this.state.model).then(ar => {
                const onSubmitSuccess = this.props.onSubmitSuccess;
                if (!ar.isError() && onSubmitSuccess) {
                    if (_.isFunction(onSubmitSuccess)) {
                        return onSubmitSuccess.bind(this)(ar);
                    }

                    if (_.isString(onSubmitSuccess)) {
                        Webiny.Router.goToRoute(onSubmitSuccess);
                    }
                }
            });
        });
    }
}

ApiContainer.defaultProps = {
    connectToRouter: false
};

export default ApiContainer;