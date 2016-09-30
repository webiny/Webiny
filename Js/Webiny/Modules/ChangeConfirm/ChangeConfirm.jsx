import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ChangeConfirm extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        const input = this.getInput(props);
        this.state = {
            value: input.props.valueLink ? input.props.valueLink.value : input.props.value
        };

        this.hasValueLink = _.has(input.props, 'valueLink');
        this.message = null;

        this.bindMethods('onChange,onConfirm,onCancel');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        const input = this.getInput(props);
        this.setState({value: input.props.valueLink ? input.props.valueLink.value : input.props.value});
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }

    onChange(value) {
        const input = this.getInput(this.props);
        let component = null;
        if (input.props.form) {
            component = input.props.form.getInput(input.props.name);
        }

        let msg = this.props.message;
        if (_.isFunction(msg)) {
            msg = msg(value, this.hasValueLink ? this.realValueLink.value : input.props.value, component);
        }

        if (!msg) {
            if (this.hasValueLink) {
                this.realValueLink.requestChange(value);
            } else {
                this.realOnChange(value);
            }
            return;
        }

        this.message = msg;
        this.value = value;
        this.refs.dialog.show();
    }

    getInput(props) {
        return React.Children.toArray(props.children)[0];
    }

    onCancel() {
        const cancelValue = this.props.onCancel(this.getInput(this.props).props.form);
        const callback = this.hasValueLink ? this.realValueLink.requestChange : this.realOnChange;
        if (!_.isUndefined(cancelValue)) {
            callback(cancelValue);
        } else {
            if (this.hasValueLink) {
                this.realValueLink.requestChange(this.realValueLink.value);
            }
        }
        this.refs.dialog.hide();
    }

    onConfirm() {
        const callback = this.hasValueLink ? this.realValueLink.requestChange : this.realOnChange;
        return callback(this.value);
    }
}

ChangeConfirm.defaultProps = {
    onComplete: _.noop,
    onCancel: _.noop,
    renderDialog: null,
    renderer() {
        // Input
        const input = this.getInput(this.props);
        let props = null;
        if (this.hasValueLink) {
            this.realValueLink = input.props.valueLink;
            props = _.omit(input.props, ['valueLink']);
            props.valueLink = this.bindTo('value', this.onChange);
        } else if (input.props.onChange) {
            this.realOnChange = input.props.onChange;
            props = _.omit(input.props, ['onChange']);
            props.onChange = this.onChange;
        } else {
            return input;
        }

        const dialogProps = {
            ref: 'dialog',
            message: () => this.message,
            onConfirm: this.onConfirm,
            onCancel: this.onCancel,
            onComplete: this.props.onComplete
        };

        if (_.isFunction(this.props.renderDialog)) {
            dialogProps['renderDialog'] = this.props.renderDialog;
        }

        return (
            <webiny-change-confirm>
                {React.cloneElement(input, props)}
                <Ui.Modal.Confirmation {...dialogProps}/>
            </webiny-change-confirm>
        );
    }
};

export default ChangeConfirm;
