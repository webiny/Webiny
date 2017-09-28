import Webiny from 'webiny';
import React from 'react';

class NotificationModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Modal, Button, Filters, notification} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title={notification.subject}/>
                    <Modal.Body>
                        <p>{notification.text}</p>
                        Created: <Filters.TimeAgo value={notification.createdOn}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button label="Close" onClick={this.hide}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(NotificationModal, {modules: ['Modal', 'Button', 'Filters']});