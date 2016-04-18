import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ModalAction extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        };

        this.bindMethods('showModal');
    }

    showModal() {
        this.refs.dialog.show();
    }
}

ModalAction.defaultProps = {
    hide: _.noop,
    renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const modalActions = {
            hide: () => () => this.refs.dialog.hide()
        };

        const modal = this.props.children.call(this, this.props.data, this.props.actions, modalActions);

        return (
            <Ui.Link onClick={this.showModal}>
                {React.cloneElement(modal, {ref: 'dialog'})}
                {this.props.label}
            </Ui.Link>
        );
    }
};

export default ModalAction;