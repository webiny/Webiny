import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ChangeConfirm extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.getInput(props).props.valueLink.value
        };

        this.message = null;

        this.bindMethods('onChange,onConfirm,onCancel');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({value: this.getInput(props).props.valueLink.value});
    }

    onChange(value) {
        this.setState({newValue: value});
        const input = this.getInput(this.props);
        const component = input.props.form.getInput(input.props.name);
        let msg = this.props.message;
        if (_.isFunction(msg)) {
            msg = msg(value, this.realValueLink.value, component);
        }

        if (!msg) {
            this.realValueLink.requestChange(value);
            return;
        }

        this.message = msg;
        this.value = value;
        this.setState({time: new Date().getTime()}, this.refs.dialog.show);
    }

    getInput(props) {
        return React.Children.toArray(props.children)[0];
    }

    onCancel() {
        const cancelValue = this.props.onCancel && this.props.onCancel(this.getInput(this.props).props.form) || undefined;
        if (!_.isUndefined(cancelValue)) {
            this.realValueLink.requestChange(cancelValue);
        } else {
            this.realValueLink.requestChange(this.realValueLink.value);
        }
        this.refs.dialog.hide();
    }

    onConfirm() {
        this.realValueLink.requestChange(this.value);
        this.refs.dialog.hide();
    }
}

ChangeConfirm.defaultProps = {
    renderer() {
        // Input
        const input = this.getInput(this.props);
        this.realValueLink = input.props.valueLink;
        const props = _.omit(input.props, ['valueLink']);
        props.valueLink = this.bindTo('value', this.onChange);

        return (
            <webiny-change-confirm>
                {React.cloneElement(input, props)}
                <Ui.Modal.Confirmation ref="dialog" message={() => this.message} onConfirm={this.onConfirm} onCancel={this.onCancel}/>
            </webiny-change-confirm>
        );
    }
};

export default ChangeConfirm;
