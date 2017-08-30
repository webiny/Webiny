import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';


class LoginModal extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);
    }

    renderDialog() {
        const {Modal, Form, Button, Input, Password, Link, Grid} = this.props;

        return (
            <Modal.Dialog>
                <Form>
                    {(model, form) => (
                        <Modal.Content>
                            <Form.Loader/>

                            <Modal.Header onClose={this.hide} title="Sign In"/>

                            <Modal.Body>

                                <Grid.Row>
                                    <Form.Error/>

                                    <Grid.Col all={12}>
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
                                            description={<Link className="small" onClick={() => {
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