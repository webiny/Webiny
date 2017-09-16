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
            api: Webiny.Auth.getApiEndpoint(),
            url: 'register',
            fields: 'id,firstName,lastName,email',
            onSubmitSuccess: () => this.setState({success: true}),
            onCancel: this.hide,
            onSuccessMessage: null
        };


        return (
            <Modal.Dialog>
                <Form {...containerProps}>
                    {(model, form) => (
                        <Modal.Content>
                            <Modal.Header title="Register" onClose={this.hide}/>
                            <Modal.Body>

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
                                        />
                                    </Grid.Col>

                                </Grid.Row>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    type="secondary"
                                    onClick={form.submit}
                                    size="large"
                                    icon="icon-next"
                                    label="Register"/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>

        );
    }

    renderSuccess() {
        const {Modal, Icon, Link} = this.props;

        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Body>
                        <div className="text-center">
                            <br/>
                            <Icon type="success" size="4x" icon="fa-check-circle" element="div"/><br/>
                            <h4>Done</h4>

                            <p>Thanks for registering!</p>
                            <p>Your profile is ready, <Link className="text-link" onClick={this.close}>back to login page.</Link></p>

                        </div>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Dialog>

        );
    }

    renderDialog() {
        const {Modal, Link} = this.props;
        return (this.state.success ? this.renderSuccess() : this.renderRegisterForm());
    }
}

export default Webiny.createComponent(ModalForm, {
    styles,
    modules: ['Modal', 'Form', 'Input', 'Password', 'Button', 'Link', 'Icon', 'Grid', 'Link']
});