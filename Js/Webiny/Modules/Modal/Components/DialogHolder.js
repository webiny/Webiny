import Webiny from 'Webiny';

/**
 * This component is needed only because we need to know for sure when modal dialog content has rendered or is about to unmount.
 * Since Dialog is being rendered using ModalContainer, without this component we can not be sure when is it done rendering.
 */
class DialogHolder extends Webiny.Ui.Component {

    componentDidMount() {
        super.componentDidMount();
        this.props.onShown();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.onHidden();
    }
}

DialogHolder.defaultProps = {
    renderer() {
        return this.props.children;
    }
};

export default DialogHolder;