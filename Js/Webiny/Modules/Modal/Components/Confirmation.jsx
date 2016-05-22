import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Confirmation extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.data = [];
        this.bindMethods('renderContent,onCancel,onConfirm');
    }

    show() {
        this.setState({time: new Date().getTime()});
        super.show();
    }

    onCancel() {
        if (_.isFunction(this.props.onCancel)) {
            return this.props.onCancel(this);
        }
        this.hide();
    }

    onConfirm() {
        if (_.isFunction(this.props.onConfirm)) {
            const data = _.clone(this.data);
            data.push(this);
            this.props.onConfirm(...data);
        }
        this.hide();
    }

    renderContent() {
        let content = this.props.message;
        if (!content) {
            content = this.props.children;
        }

        if (_.isFunction(content)) {
            content = content();
        }
        return content;
    }

    setData(...data) {
        this.data = data;
        return this;
    }
}

Confirmation.defaultProps = {
    title: 'Confirmation dialog',
    confirm: 'Yes',
    cancel: 'No',
    onConfirm: _.noop,
    onCancel: null,
    renderer() {
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