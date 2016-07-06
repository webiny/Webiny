import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

function insertKey(data) {
    if (!data) {
        data = [];
    }
    _.each(data, (v, i) => {
        if (!_.has(data[i], '$key')) {
            data[i]['$key'] = _.uniqueId('dynamic-fieldset-');
        }
    });
    return data;
}

class Fieldset extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.currentIndex = 0;
        this.rowTemplate = null;
        this.headerTemplate = _.noop;
        this.emptyTemplate = null;

        this.actions = {
            add: index => () => this.addData(index),
            remove: index => () => this.removeData(index)
        };

        this.bindMethods('parseLayout,registerInputs,registerInput,addData,removeData');
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({model: insertKey(_.clone(this.props.valueLink.value))});
        this.parseLayout(this.props.children);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.parseLayout(props.children);
        this.setState({model: insertKey(_.clone(props.valueLink.value))});
    }

/*    shouldComponentUpdate(nextProps) {
        const omit = ['children', 'key', 'ref', 'valueLink'];
        const oldProps = _.omit(this.props, omit);
        const newProps = _.omit(nextProps, omit);

        const update = !_.isEqual(newProps, oldProps) || !_.isEqual(nextProps.valueLink.value, this.props.valueLink.value);
        console.log("WILL UPATE", update);
        return update;
    }*/

    parseLayout(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }

        React.Children.map(children, child => {
            if (child.type === Ui.Dynamic.Row) {
                this.rowTemplate = child.props.children;
            }

            if (child.type === Ui.Dynamic.Header) {
                this.headerTemplate = child.props.children;
            }

            if (child.type === Ui.Dynamic.Empty) {
                this.emptyTemplate = child.props.children;
            }
        });
    }

    removeData(index) {
        const model = _.clone(this.props.valueLink.value);
        model.splice(index, 1);
        this.props.valueLink.requestChange(model);
    }

    addData(index) {
        const model = this.props.valueLink.value ? _.clone(this.props.valueLink.value) : [];
        model.splice(index + 1, 0, {$key: _.uniqueId('dynamic-fieldset-')});
        this.props.valueLink.requestChange(model);
    }

    registerInput(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        if (child.props && child.props.name) {
            const newProps = _.assign({}, child.props, {
                __tabs: this.props.__tabs,
                attachToForm: this.props.attachToForm,
                attachValidators: this.props.attachValidators,
                detachFromForm: this.props.detachFromForm,
                validateInput: this.props.validateInput,
                form: this.props.form,
                // give the component a full name to register with the form, to trigger validation properly
                name: this.props.name + '.' + this.currentIndex + '.' + child.props.name,
                valueLink: this.bindTo('model.' + this.currentIndex + '.' + child.props.name, () => {
                    this.props.valueLink.requestChange(this.state.model);
                })
            });

            return React.cloneElement(child, newProps);
        }
        return React.cloneElement(child, _.omit(child.props, ['key', 'ref']), this.registerInputs(child.props && child.props.children));
    }

    registerInputs(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.registerInput);
    }
}

Fieldset.defaultProps = {
    defaultValue: [],
    renderer() {
        if (this.state.model && this.state.model.length) {
            return (
                <div className="form-group">
                    {this.headerTemplate(this.actions)}
                    {this.state.model.map((r, i) => {
                        this.currentIndex = i;
                        return (
                            <webiny-dynamic-fieldset-row key={r['$key']}>
                                {this.registerInputs(this.rowTemplate(r, i, this.actions))}
                            </webiny-dynamic-fieldset-row>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="form-group">
                {this.registerInputs(this.emptyTemplate(this.actions))}
            </div>
        );
    }
};

export default Fieldset;