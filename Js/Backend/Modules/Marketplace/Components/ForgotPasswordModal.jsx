import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';


class ForgotPasswordModal extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);

        this.state = {
            success: true
        };
    }

    renderDialog() {
        const {Modal, Form, Button, Input, Password, Link, Grid, Alert} = this.props;


        return (
            <Modal.Dialog>
                <Form>
                    {(model, form) => (
                        <Modal.Content>
                            <Form.Loader/>

                            <Modal.Header onClose={this.hide} title="Forgot Password"/>

                            <Modal.Body>

                                <Grid.Row>
                                    <Form.Error/>

                                    <Grid.Col all={12}>
                                        {this.state.success && (
                                            <Alert type="success" title="Instructions sent">Please check your inbox for the reset
                                                password link.</Alert>)}
                                    </Grid.Col>

                                    <Grid.Col all={12}>
                                        <Input
                                            placeholder="Email"
                                            label="Email"
                                            name="username"
                                            validate="required, email"
                                            onEnter={form.submit}/>
                                    </Grid.Col>

                                    <Grid.Col all={12} className={styles.modalAction}>
                                        <Button
                                            type="primary"
                                            onClick={form.submit}
                                            size="large"
                                            icon="icon-next"
                                            label="Submit"/>
                                    </Grid.Col>
                                </Grid.Row>

                            </Modal.Body>
                            <Modal.Footer>
                                <div className="text-center">
                                    Not a member? <Link onClick={() => this.hide().then(this.props.showRegister)}><br/>
                                    Sign up here
                                </Link>
                                </div>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ForgotPasswordModal, {
    styles,
    modules: ['Modal', 'Form', 'Button', 'Input', 'Password', 'Link', 'Grid', 'Alert']
});