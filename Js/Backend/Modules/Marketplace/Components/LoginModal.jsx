import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';

class LoginModal extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);
        this.bindMethods('onSuccess');
    }

    onSuccess(apiResponse) {
        this.hide().then(() => this.props.onUser(apiResponse.getData()));
    }

    renderDialog() {
        const {Modal, Form, Button, Input, Password, Link, Grid} = this.props;

        const formProps = {
            api: '/services/webiny/marketplace',
            url: 'login',
            onSubmit: this.submit,
            onSubmitSuccess: this.onSuccess,
            onSuccessMessage: null
        };

        return (
            <Modal.Dialog>
                <Form {...formProps}>
                    {(model, form) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header onClose={this.hide} title="Sign In"/>
                            <Modal.Body>
                                <Grid.Row>
                                    <Grid.Col all={12}>
                                        <Form.Error/>
                                        <Input
                                            placeholder="Email"
                                            label="Email"
                                            name="username"
                                            validate="required, email"
                                            onEnter={form.submit}/>
                                    </Grid.Col>
                                    <Grid.Col all={12}>
                                        <Password
                                            label="Password"
                                            placeholder="Password"
                                            name="password"
                                            validate="required"
                                            onEnter={form.submit}
                                            description={<Link className="small pull-right" onClick={() => {
                                                this.hide().then(() => this.props.showForgotPassword())
                                            }}>I CAN'T REMEMBER</Link>}
                                        />
                                    </Grid.Col>
                                    <Grid.Col all={12} className={styles.modalAction}>
                                        <Button
                                            type="primary"
                                            onClick={form.submit}
                                            size="large"
                                            icon="icon-next"
                                            label="Sign In"/>
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

export default Webiny.createComponent(LoginModal, {styles, modules: ['Modal', 'Form', 'Button', 'Input', 'Password', 'Link', 'Grid']});