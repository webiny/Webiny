import Basic from './Basic';

/**
 * This is a form view which handles most often-needed actions
 * It automatically sets state variables, stores, validation functionality, submit, alerts, redirecting
 */
class Form extends Basic {

    constructor() {
        super();

        _.assign(this.state, {
            model: {},
            options: {}
        });

        this.bindMethods('submit', 'prepareStore', 'formReset');
    }

    /**
     * On first mount, we have to check if an ID was passed in URL
     */
    componentWillMount() {
        this.store = this.getStore(this.getStoreFqn());
        this.onStoreChanged(this.store, 'model');
        this.onRouteChanged(this.prepareStore);
        super.componentWillMount();
    }

	componentWillUnmount(){
		super.componentWillUnmount();
		if(this.getStoreFqn){
			this.trigger(this.getStoreFqn() + '.Reset');
		}
	}

    getHeaderIcon() {
        return Rad.Components.Icon.Type.PENCIL;
    }

    getParams() {
        return {};
    }

    prepareStore() {
        return Q.when(this.getId()).then(id => {
            if (id) {
                this.showLoader();
                return this.trigger(this.getStoreFqn() + '.Get', [id, this.getParams()]).then(res => {
                    this.hideLoader();
                    return res;
                });
            }
			return this.store.getState().then(state => {
				var newModel = this.state.model;
				_.assign(newModel, state);
				this.setState({model: newModel});
			});
        });
    }

	submit(form, data = false) {
        var event = this.formGetSaveEvent();
		this.showLoader();

        var payload = data ? data : this.state.model;
        return this.trigger(event, payload).then(apiResponse => {

            if (apiResponse.isSuccess()) {
                this.formHandleSubmitSuccess(apiResponse);
            } else {
				this.formHandleSubmitErrors(apiResponse);
			}
			this.hideLoader();
            return apiResponse;
        });
    }

    getSaveRedirectRoute() {
        return Rad.Router.getActiveRoute().getModule().getNamespace('List');
    }

    /** ------------ Functionality in separate methods for easier overriding of submit() method ------------*/

    formGetSaveEvent() {
        return this.getStoreFqn() + (this.getId() ? '.Update' : '.Create');
    }

    formHandleSubmitSuccess(apiResponse) {
        this.setState({model: apiResponse.getData()});
        Rad.EventManager.emit('Alert.Success.Create', this.formSaveSuccessMessage(apiResponse));
        if (_.isString(this.getSaveRedirectRoute())) {
            Rad.Router.goToRoute(this.getSaveRedirectRoute());
        }
    }

    formSaveSuccessMessage(apiResponse) {
        return 'Saved successfully.'
    }

    formHandleSubmitErrors(apiResponse) {
        var messages = [];
        apiResponse.getErrorReport('errors').forEach(error => {
            messages = messages.concat(_.values(error));
        });
        this.setAlert(messages, 'danger');
    }

	formReset(){
		this.setState({model: {}});
	}
}

export default Form;