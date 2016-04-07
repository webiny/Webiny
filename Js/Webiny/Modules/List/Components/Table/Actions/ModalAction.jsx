import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ModalAction extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        };

        this.bindMethods('showModal,hideModal');
    }

    showModal() {
        this.setState({showModal: true});
    }

    hideModal() {
        this.setState({showModal: false});
    }

}

ModalAction.defaultProps = {
    hide: _.noop,
    renderer: function renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const modalActions = {
            hide: () => () => this.hideModal()
        };

        let modal = this.props.children.call(this, this.props.data, this.props.actions, modalActions);

        modal = React.cloneElement(modal, {
            show: this.state.showModal,
            onHide: this.hideModal
        });

        return (
            <Ui.Link onClick={this.showModal}>
                {modal}
                {this.props.label}
            </Ui.Link>
        );
    }
};

export default ModalAction;