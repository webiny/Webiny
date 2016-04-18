import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const t = Webiny.i18n;

class Confirmation extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('renderContent,show,hide,onCancel,onConfirm');
    }

    hide() {
        this.refs.dialog.hide();
    }

    show() {
        this.refs.dialog.show();
    }

    onCancel() {
        if (_.isFunction(this.props.onCancel)) {
            this.props.onCancel(this);
        } else {
            this.hide();
        }
    }

    onConfirm() {
        if (_.isFunction(this.props.onConfirm)) {
            this.props.onConfirm(this);
        }
    }

    renderContent() {
        let content = this.props.message;
        if (!content) {
            content = this.props.children;
        }

        return content;
    }
}

Confirmation.defaultProps = {
    title: 'Confirmation dialog',
    confirm: 'Yes',
    cancel: 'No',
    onConfirm: _.noop,
    onCancel: null,
    renderer: function renderer() {
        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title={this.props.title}/>
                <Ui.Modal.Body>{this.renderContent()}</Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label={this.props.cancel} onClick={this.onCancel}/>
                    <Ui.Button type="primary" label={this.props.confirm} onClick={this.onConfirm}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
};

export default Confirmation;