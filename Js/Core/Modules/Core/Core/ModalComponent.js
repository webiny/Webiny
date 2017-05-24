import Webiny from 'Webiny';
import Component from './Component'; // Need to import this file directly because at this point `Webiny` is not fully populated

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.bindMethods('show,hide,renderDialog');
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (DEVELOPMENT && Webiny.isHotReloading()) {
            return true;
        }
        const omitProps = ['renderer', 'renderDialog'];
        const newProps = _.omit(nextProps, omitProps);
        const oldProps = _.omit(this.props, omitProps);
        return !_.isEqual(newProps, oldProps) || !_.isEqual(nextState, this.state);
    }

    hide() {
        return this.refs.dialog.hide();
    }

    show() {
        return this.refs.dialog.show();
    }

    isAnimating() {
        return this.refs.dialog.isAnimating();
    }

    renderDialog() {
        if (_.isFunction(this.props.renderDialog)) {
            return this.props.renderDialog.call(this, this);
        }

        throw new Error('Implement renderDialog() method in your modal component class or add a renderDialog() function through props!');
    }
}

ModalComponent.defaultProps = {
    renderDialog: null,
    renderer() {
        const dialog = this.renderDialog();
        if (Webiny.isElementOfType(dialog, Webiny.Ui.Components.Modal.Dialog)) {
            const props = {ref: 'dialog', onHidden: this.props.onHidden};
            return React.cloneElement(dialog, props);
        }

        throw new Error('renderDialog() method of your modal component class MUST return a Modal.Dialog element');
    }
};

export default ModalComponent;
