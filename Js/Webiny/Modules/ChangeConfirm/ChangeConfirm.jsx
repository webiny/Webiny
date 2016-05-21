import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ChangeConfirm extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.getInput(props).props.valueLink.value
        };

        this.dialogProps = {};

        this.bindMethods('onChange');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({value: this.getInput(props).props.valueLink.value});
    }

    onChange(value) {
        this.setState({newValue: value});
        const input = this.getInput(this.props);
        const component = input.props.form.getInput(input.props.name);
        const msg = _.isFunction(this.props.message) && this.props.message(value, this.realValueLink.value, component) || null;
        if (!msg) {
            this.realValueLink.requestChange(value);
            return;
        }

        // Dialog
        this.dialogProps = {
            message: msg,
            onCancel: () => {
                const cancelValue = this.props.onCancel && this.props.onCancel(this.getInput(this.props).props.form) || undefined;
                if (!_.isUndefined(cancelValue)) {
                    this.realValueLink.requestChange(cancelValue);
                } else {
                    this.realValueLink.requestChange(this.realValueLink.value);
                }
                this.refs.dialog.hide();
            },
            onConfirm: () => {
                this.realValueLink.requestChange(value);
                this.refs.dialog.hide();
            }
        };

        this.refs.dialog.show();
    }

    getInput(props) {
        return React.Children.toArray(props.children)[0];
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
                <Ui.Modal.Confirmation ref="dialog" {...this.dialogProps}/>
            </webiny-change-confirm>
        );
    }
};

export default ChangeConfirm;
