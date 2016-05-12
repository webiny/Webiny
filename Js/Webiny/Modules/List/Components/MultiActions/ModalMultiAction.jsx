import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

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

        return (
            <Ui.Link onClick={() => this.refs.dialog.show()}>
                {React.cloneElement(modal, {ref: 'dialog'})}
                {this.props.label}
            </Ui.Link>
        );
    }
};

export default ModalMultiAction;