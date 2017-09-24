import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';

class ForgotPasswordModal extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);

        this.state = {
            success: false
        };
    }

    renderDialog() {
        const {Modal, Form, Button, Input, Link, Grid, Alert} = this.props;

        const formProps = {
            api: '/services/webiny/marketplace',
            url: 'reset-password',
            onSuccessMessage: null,
            onSubmitSuccess: () => this.setState({success: true})
        };

        return (
            <Modal.Dialog onHidden={() => this.setState({success: false})}>
                <Form {...formProps}>
                    {({form}) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header onClose={this.hide} title="Forgot Password"/>
                            <Modal.Body>
                                {this.state.success && (
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Alert type="success" title="Instructions sent">
                                                Please check your inbox for the reset password link.
                                            </Alert>
                                        </Grid.Col>
                                    </Grid.Row>
                                )}
                                {!this.state.success && (
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <p className="text-center">
                                                Enter an email address you used to register at webiny.com.
                                            </p>
                                            <Form.Error/>
                                            <Input
                                                placeholder="Email"
                                                label="Email"
                                                name="email"
                                                validate="required, email"
                                                onEnter={form.submit}/>
                                        </Grid.Col>
                                    </Grid.Row>
                                )}
                            </Modal.Body>
                            {!this.state.success && (
                                <Modal.Footer>
                                    <Button
                                        type="primary"
                                        onClick={form.submit}
                                        size="large"
                                        icon="icon-next"
                                        label="Send me a reset link"/>
                                </Modal.Footer>
                            )}
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ForgotPasswordModal, {
    styles,
    modules: ['Modal', 'Form', 'Button', 'Input', 'Link', 'Grid', 'Alert']
});