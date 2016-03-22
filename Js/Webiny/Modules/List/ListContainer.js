import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ListContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            meta: {},
            data: []
        };

        if (props.api) {
            if (props.api instanceof Webiny.Api.Entity) {
                this.api = props.api;
            } else {
                this.api = new Webiny.Api.Entity(props.api, props.fields);
            }
        }

        this.bindMethods('registerList,prepareChildren,prepareChild');
    }

    componentWillMount() {
        super.componentWillMount();
        if (this.api) {
            this.api.crudList().then(apiResponse => {
                const data = apiResponse.getData();
                this.setState({data: data.data, meta: data.meta});
            });
        }
    }

    prepareChild(child, index) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        const props = _.clone(child.props);
        props.key = index;
        // Pass model, container, ui and callbacks to each form you encounter
        if (child.type === Ui.List) {
            this.formsCount++;

            // Pass relevant props from ListContainer to List
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
            props.title = this.props.title;

            // These callbacks are only passed to the main form
            if (this.formsCount === 1) {
                props.onSubmit = this.props.onSubmit && this.props.onSubmit.bind(this) || this.onSubmit;
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

    render() {
        const content = this.prepareChildren(this.props.children);
        return (
            <webiny-list-container>{content}</webiny-list-container>
        );
    }
}

export default ListContainer;