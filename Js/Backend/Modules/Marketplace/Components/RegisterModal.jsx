import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';

class ModalForm extends Webiny.Ui.ModalComponent {
    constructor(props) {
        super(props);

        this.state = {
            success: false
        };

        this.bindMethods('login');
    }

    login() {
        this.hide().then(() => this.props.showLogin());
    }

    show() {
        this.setState({success: false});
        return super.show();
    }

    renderRegisterForm() {
        const containerProps = {
            api: Webiny.Auth.getApiEndpoint().setUrl('/register'),
            fields: 'id,firstName,lastName,email',
            onSubmitSuccess: () => this.setState({success: true}),
            onCancel: this.hide,
            onSuccessMessage: null
        };

        const {Form, Input, Password, Button, Grid, Link} = this.props;

        return (
            <Form {...containerProps}>
                {(model, form) => (
                    <Grid.Row>
                        <Grid.Col all={12}>
                            <Form.Error/>
                        </Grid.Col>
                        <Grid.Col all={6}>
                            <Input
                                placeholder="First Name"
                                label="First Name"
                                name="firstName"
                                validate="required"
                                onEnter={form.submit}/>
                        </Grid.Col>

                        <Grid.Col all={6}>
                            <Input
                                placeholder="Last Name"
                                label="Last Name"
                                name="lastName"
                                validate="required"
                                onEnter={form.submit}/>
                        </Grid.Col>

                        <Grid.Col all={12}>
                            <Input
                                placeholder="Email"
                                label="Email"
                                name="email"
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
                                type="secondary"
                                onClick={form.submit}
                                size="large"
                                icon="icon-next"
                                label="Register"/>
                        </Grid.Col>
                    </Grid.Row>
                )}
            </Form>
        );
    }

    renderSuccess() {
        const {Icon, Link} = this.props;

        return (
            <div className="text-center">
                <br/>
                <Icon type="success" size="4x" icon="fa-check-circle" element="div"/><br/>
                <h4>Done</h4>

                <p>Thanks for registering!</p>
                <p>Your profile is ready, <Link className="text-link" onClick={this.login}>click here to login.</Link></p>

            </div>
        );
    }

    renderDialog() {
        const {Modal, Link} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Content>
                    {!this.state.success ? <Modal.Header title="Register"/> : null}
                    <Modal.Body>
                        {this.state.success ? this.renderSuccess() : this.renderRegisterForm()}
                    </Modal.Body>
                    {!this.state.success && (
                        <Modal.Footer>
                            <div className="text-center">
                                Already a member? <br/><Link className="text-link" onClick={this.login}>Login here</Link>
                            </div>
                        </Modal.Footer>
                    )}
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ModalForm, {
    styles,
    modules: ['Modal', 'Form', 'Input', 'Password', 'Button', 'Link', 'Icon', 'Grid', 'Link']
});