import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class BaseContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: {}
        };

        this.mainForm = null;
        this.formsCount = 0;
        this.linkedForms = [];

        this.bindMethods('registerForm,loadData,getData,onSubmit,onInvalid,onReset,onCancel,prepareChildren,prepareChild,submit,reset,validate,cancel');
    }

    componentWillMount() {
        super.componentWillMount();
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
    }

    /* eslint-disable */

    loadData(id = null) {
        throw new Error('Implement loadData method in your form container class!');
    }

    /* eslint-enable */

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

    /* eslint-disable */
    onSubmit(model) {
        throw new Error('Implement onSubmit method in your form container class!');
    }

    /* eslint-enable */

    onInvalid() {
        console.log('Form Container [ON INVALID]');
    }

    onReset() {
        this.props.onReset();
    }

    onCancel() {
        console.log('Form Container [ON CANCEL]');
        if (_.isString(this.props.onCancel)) {
            Webiny.Router.goToRoute(this.props.onCancel);
        } else if (_.isFunction(this.props.onCancel)) {
            this.props.onCancel();
        }
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

            // Pass relevant props from BaseContainer to Form
            _.each(this.props, (value, name) => {
                if (_.startsWith(name, 'render') || _.startsWith(name, 'option') || _.startsWith(name, 'onChange') || name === 'title') {
                    props[name] = value;
                }
            });

            props.data = this.state.model;
            props.defaultData = this.props.defaultModel || {};
            props.container = this;
            if (!props.ui) {
                props.ui = props.name = this.props.ui + '-' + this.formsCount;
            }
            props.title = _.get(props, 'title', this.props.title);

            // These callbacks are only passed to the main form
            if (this.formsCount === 1) {
                props.onSubmit = this.props.onSubmit || this.onSubmit;
                props.onReset = this.onReset;
                props.onCancel = this.onCancel;
            }

            // onInvalid callback requires special handling and is passed to ALL linked forms
            // We need to call the invalid callback defined on the form itself + the one passed via props
            const invalidCallback = props.onInvalid;
            props.onInvalid = () => {
                invalidCallback();
                if (this.props.onInvalid) {
                    this.props.onInvalid.call(this);
                } else {
                    this.onInvalid();
                }
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

export default BaseContainer;