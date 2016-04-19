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

        this.loadData(this.props.id);
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

    onSubmit(data) {
        // Merge initial Container data with new data received from all forms
        const newData = _.assign({}, this.state.model, data);
        this.setState({model: Webiny.Tools.removeKeys(newData)});

        // If onSubmit was passed through props, execute it. Otherwise proceed with default behaviour.
        if (this.props.onSubmit) {
            return this.props.onSubmit(newData, this);
        }

        if (newData.id) {
            return this.api.execute('PATCH', newData.id, newData).then(ar => {
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

        return this.api.execute('POST', '/', newData).then(ar => {
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
}

ApiContainer.defaultProps = {
    connectToRouter: false
};

export default ApiContainer;