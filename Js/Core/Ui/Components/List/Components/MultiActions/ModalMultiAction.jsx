import Webiny from 'Webiny';

class ModalMultiAction extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: null
        };
    }
}

ModalMultiAction.defaultProps = {
    hide: _.noop,
    renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const modalActions = {
            hide: () => {
                if (this.dialog) {
                    setTimeout(this.dialog.hide, 10);
                }
            }
        };

        const onAction = () => {
            if (this.props.data.length) {
                const modal = this.props.children.call(this, this.props.data, this.props.actions, modalActions);
                this.setState({modal});
            }
        };

        const {Link} = this.props;

        const dialogProps = {
            ref: ref => this.dialog = ref,
            onComponentDidMount: dialog => dialog.show(),
            onHidden: () => {
                this.dialog = null;
                this.setState({modal: null});
            }
        };

        return (
            <Link onClick={onAction}>
                {this.state.modal ? React.cloneElement(this.state.modal, dialogProps) : null}
                {this.props.label}
            </Link>
        );
    }
};

export default Webiny.createComponent(ModalMultiAction, {modules: ['Link']});