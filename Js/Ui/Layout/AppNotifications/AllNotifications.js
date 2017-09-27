import Webiny from 'webiny';
import React from 'react';

class Details extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Modal, Button, notification} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title={notification.subject}/>
                    <Modal.Body>
                        <h2>Job ID: {notification.data.id}</h2>
                        <p>{notification.text}</p>
                        <span>{notification.createdOn}</span>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(Details, {modules: ['Modal', 'Button']});