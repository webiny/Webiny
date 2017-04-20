import Webiny from 'Webiny';

class ModalMultiAction extends Webiny.Ui.Component {

}

ModalMultiAction.defaultProps = {
    hide: _.noop,
    renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const modalActions = {
            hide: () => {
                setTimeout(this.refs.dialog.hide);
            }
        };

        const modal = this.props.children.call(this, this.props.data, this.props.actions, modalActions);

        const onAction = () => {
            if (this.props.data.length) {
                this.refs.dialog.show();
            }
        };

        const {Link} = this.props;

        return (
            <Link onClick={onAction}>
                {React.cloneElement(modal, {ref: 'dialog'})}
                {this.props.label}
            </Link>
        );
    }
};

export default Webiny.createComponent(ModalMultiAction, {modules: ['Link']});