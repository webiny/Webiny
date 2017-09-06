import React from 'react';
import Webiny from 'webiny';

class TwoFactorAuthConfirmation extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Modal, Data, Grid, Alert, Button, Section} = this.props;

        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title="Two Factor Auth" onClose={this.hide}/>
                    <Modal.Body>
                        <Grid.Row>
                            <Grid.Col all={12}>
                                <Alert type="success" title="Success">Your two factor authentication is now active.</Alert>
                            </Grid.Col>
                            <Grid.Col all={4}>
                                <Section title="Recovery codes" icon="fa-lock"/>
                                <Data api="/entities/webiny/user/2factor-recovery-codes" waitForData={true}>
                                    {(data, filter, loader) => {
                                        if (loader) {
                                            return loader;
                                        }
                                        return (
                                            <pre>{data.recoveryCodes}</pre>
                                        );
                                    }}
                                </Data>
                            </Grid.Col>
                            <Grid.Col all={8}>
                                <Section title="Important" icon="fa-exclamation"/>
                                <p>
                                    Please write down the recovery codes. In case you can't generate a code via the authenticator app for some reason,
                                    you can use a recovery code to access your account.
                                </p>
                                <p>Note that once you use a specific code, it gets deleted.</p>
                            </Grid.Col>
                        </Grid.Row>
                    </Modal.Body>
                    <Modal.Footer clasName="text-center">
                        <Button type="primary" label="I've noted the recovery codes" onClick={this.hide}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(TwoFactorAuthConfirmation, {
    modules: ['Modal', 'Data', 'Grid', 'Alert', 'Button', 'Section']
});