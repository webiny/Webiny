import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FieldSet extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.currentIndex = 0;
        this.rowTemplate = null;
        this.emptyTemplate = null;

        this.actions = {
            add: index => () => this.addData(index),
            remove: index => () => this.removeData(index)
        };

        this.bindMethods('parseLayout,registerInputs,registerInput,addData,removeData');
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({model: _.clone(this.props.valueLink.value) || []});
        this.parseLayout(this.props.children);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({model: _.clone(props.valueLink.value) || []});
    }

    parseLayout(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }


        React.Children.map(children, child => {
            if (child.type === Ui.Dynamic.Row) {
                this.rowTemplate = child.props.children;
            }

            if (child.type === Ui.Dynamic.Empty) {
                this.emptyTemplate = child.props.children;
            }
        });
    }

    removeData(index) {
        this.state.model.splice(index, 1);
        this.setState({model: this.state.model}, () => {
            this.props.valueLink.requestChange(this.state.model);
        });
    }

    addData(index) {
        this.state.model.splice(index + 1, 0, {});
        this.setState({model: this.state.model}, () => {
            this.props.valueLink.requestChange(this.state.model);
        });
    }

    registerInput(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        if (child.props && child.props.name) {
            const newProps = _.clone(child.props);
            newProps['valueLink'] = this.bindTo('model.' + this.currentIndex + '.' + child.props.name, () => {
                this.props.valueLink.requestChange(this.state.model);
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

    render() {
        if (this.state.model.length) {
            return (
                <div className="form-group">
                    {this.state.model.map((r, i) => {
                        this.currentIndex = i;
                        return (
                            <webiny-dynamic-fieldset-item key={i}>
                                {this.registerInputs(this.rowTemplate(r, i, this.actions))}
                            </webiny-dynamic-fieldset-item>
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
}

export default FieldSet;