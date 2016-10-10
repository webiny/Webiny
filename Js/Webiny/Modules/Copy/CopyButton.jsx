import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class CopyButton extends Webiny.Ui.Component {
    componentDidMount() {
        super.componentDidMount();

        this.clipboard = new Clipboard(ReactDOM.findDOMNode(this), {
            text: () => {
                return this.props.value;
            }
        });

        this.clipboard.on('success', () => {
            const onSuccessMessage = this.props.onSuccessMessage;
            if (_.isFunction(onSuccessMessage)) {
                onSuccessMessage();
            } else if (_.isString(onSuccessMessage)) {
                Webiny.Growl.info(onSuccessMessage);
            }
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.clipboard.destroy();
    }
}

CopyButton.defaultProps = {
    label: 'Copy',
    onSuccessMessage: 'Copied to clipboard!',
    onCopy: _.noop,
    style: null,
    value: null,
    renderer() {
        const props = _.omit(this.props, ['renderer', 'onSuccessMessage', 'onCopy', 'value']);

        return <Ui.Button {...props}/>;
    }
};

export default CopyButton;
