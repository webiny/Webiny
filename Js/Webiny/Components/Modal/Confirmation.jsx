import Component from './../../Lib/Component';

class Confirmation extends Component {

    render() {
        var Button = Webiny.Components.Form.Button;
        var Modal = Webiny.Components.Modal;

        return (
            <Modal.Dialog {...this.props}>
                <Modal.Body>
                    <h2 className="strong">{this.props.title}</h2>
                    <p>{this.props.message}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.confirm} type="accept" className="btn emp btn-accept btn-block pull-right" data-dismiss="modal">
                        <i className="demo-icon icon-accept_icon"></i>Confirm
                    </Button>
                    <Button type="light" className="btn emp btn-light-gray btn-block pull-left" data-dismiss="modal">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}

Confirmation.defaultProps = {
    title: 'Confirmation',
    message: 'Are you sure you want to continue?'
};

export default Confirmation;