import React from 'react';
import Webiny from 'webiny';

class UpdateSuccessModal extends Webiny.Ui.ModalComponent {

    constructor(props){
        super(props);

        this.bindMethods('getButton');
    }

    getButton(dialog) {
        const {Button} = this.props;
        return (
            <Button type="secondary" label="Reload window" icon="fa-reload" onClick={() => dialog.hide().then(() => window.location.reload())}/>
        );
    }

    renderDialog() {
        const {Modal, app} = this.props;

        return (
            <Modal.Success closeBtn={this.getButton} onClose={() => window.location.reload()}>
                <strong>{app.name}</strong> was updated successfully!<br/><br/>
                To see the changes you need to reload this browser window.<br/>
                Click the button below to reload.
            </Modal.Success>
        );
    }
}

export default Webiny.createComponent(UpdateSuccessModal, {modules: ['Modal', 'Button']});