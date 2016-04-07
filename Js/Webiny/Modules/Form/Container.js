import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FormContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: {}
        };

        this.mainForm = null;
        this.formsCount = 0;
        this.linkedForms = [];

        if (props.api) {
            if (props.api instanceof Webiny.Api.Entity) {
                this.api = props.api;
            } else {
                this.api = new Webiny.Api.Entity(props.api, props.fields);
            }
        }

        this.bindMethods('registerForm,loadData,getData,onSubmit,onInvalid,onReset,onCancel,prepareChildren,prepareChild,submit,reset,validate,cancel');
    }

    componentWillMount() {
        super.componentWillMount();
        if (this.props.loadData) {
            return this.props.loadData.call(this).then(data => {
                this.setState({model: data});
            });
        }

        if (this.props.api) {
            this.loadData();
        } else if (this.props.data) {
            this.setState({model: this.props.data});
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (props.data) {
            this.setState({model: props.data});
        }
    }

    loadData(id = null) {
        if (this.api) {
            if (!id) {
                if (this.props.connectToRouter) {
                    id = Webiny.Router.getParams('id');
                }
            }

            if (id) {
                this.api.crudGet(id).then(apiResponse => {
                    this.setState({model: apiResponse.getData()});
                });
            }
        }
    }

    getData() {
        return this.state.model;
    }

    submit(e) {
        // This should pass 'submit' signal to the main form
        return this.mainForm.submit(e);
    }

    validate() {
        // This should pass 'validate' signal to the main form
        return this.mainForm.validate();
    }

    reset() {
        // This should pass 'reset' signal to the main form
        return this.mainForm.reset();
    }

    cancel() {
        // This should pass 'cancel' signal to the main form
        return this.mainForm.cancel();
    }

    onSubmit(model) {
        console.log("Form Container [ON SUBMIT]", model);
        this.setState({model: _.assign({}, this.state.model, model)}, () => {
            this.api.crudUpdate(this.state.model.id, this.state.model).then(ar => {
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

    onInvalid() {
        console.log("Form Container [ON INVALID]");
    }

    onReset() {
        console.log("Form Container [ON RESET]");
    }

    onCancel() {
        console.log("Form Container [ON CANCEL]");
    }

    prepareChild(child, index) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        const props = _.clone(child.props);
        props.key = index;
        // Pass model, container, ui and callbacks to each form you encounter
        if (child.type === Ui.Form.Form) {
            this.formsCount++;

            // Pass relevant props from FormContainer to Form
            _.each(this.props, (value, name) => {
                if (_.startsWith(name, 'render') || _.startsWith(name, 'option') || _.startsWith(name, 'onChange') || name == 'title') {
                    props[name] = value;
                }
            });

            props.data = this.state.model;
            props.container = this;
            if (!props.ui) {
                props.ui = props.name = this.props.ui + '-' + this.formsCount;
            }
            props.title = _.get(props, 'title', this.props.title);

            // These callbacks are only passed to the main form
            if (this.formsCount === 1) {
                props.onSubmit = this.props.onSubmit && this.props.onSubmit || this.onSubmit;
                props.onReset = this.props.onReset || this.onReset;
                props.onCancel = this.props.onCancel || this.onCancel;
            }

            // onInvalid callback requires special handling and is passed to ALL linked forms
            // We need to call the invalid callback defined on the form itself + the one passed via props
            const invalidCallback = props.onInvalid;
            props.onInvalid = () => {
                invalidCallback();
                this.props.onInvalid && this.props.onInvalid.call(this) || this.onInvalid();
            };

            return React.cloneElement(child, props);
        }

        return React.cloneElement(child, props, this.prepareChildren(props.children));
    }

    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }

    registerForm(form) {
        if (!this.mainForm) {
            this.mainForm = form;

            return this;
        }
        this.linkedForms.push(form);

        return this;
    }

    render() {
        this.formsCount = 0;

        const content = this.prepareChildren(this.props.children);
        return (
            <webiny-form-container>{content}</webiny-form-container>
        );
    }

    getLinkedForms() {
        return this.linkedForms;
    }
}

FormContainer.defaultProps = {
    connectToRouter: false
};

export default FormContainer;