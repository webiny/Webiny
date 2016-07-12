import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ClickConfirm extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.message = null;
        this.realOnClick = _.noop;

        this.bindMethods('onClick,onConfirm,onCancel');
    }

    onClick() {
        let msg = this.props.message;
        if (_.isFunction(msg)) {
            msg = msg();
        }

        if (!msg) {
            this.realOnClick();
            return;
        }

        this.message = msg;
        this.setState({time: new Date().getTime()}, this.refs.dialog.show);
    }

    getInput(props) {
        return React.Children.toArray(props.children)[0];
    }

    onCancel() {
        this.refs.dialog.hide().then(this.props.onCancel);
    }

    onConfirm() {
        return Q(this.realOnClick(this)).then(response => {
            return this.refs.dialog.hide().then(() => {
                this.props.onComplete(response);
            });
        });
    }

    hide() {
        return this.refs.dialog.hide();
    }
}

ClickConfirm.defaultProps = {
    onComplete: _.noop,
    onCancel: _.noop,
    renderDialog: null,
    renderer() {
        // Input
        const input = this.getInput(this.props);
        this.realOnClick = input.props.onClick;
        const props = _.omit(input.props, ['onClick']);
        props.onClick = this.onClick;


        const dialogProps = {
            ref: 'dialog',
            message: () => this.message,
            onConfirm: this.onConfirm,
            onCancel: this.onCancel
        };

        if (_.isFunction(this.props.renderDialog)) {
            dialogProps['renderDialog'] = this.props.renderDialog;
        }

        return (
            <webiny-click-confirm>
                {React.cloneElement(input, props)}
                <Ui.Modal.Confirmation {...dialogProps}/>
            </webiny-click-confirm>
        );
    }
};

export default ClickConfirm;
