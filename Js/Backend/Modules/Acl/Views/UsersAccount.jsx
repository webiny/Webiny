import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class UsersAccount extends Webiny.Ui.View {

}

UsersAccount.defaultProps = {
    configureContainer(container) {
        return container;
    },
    renderer() {
        const formContainer = {
            api: '/entities/core/users',
            loadModel: (container) => {
                return container.api.get('/me', {_fields: 'id,firstName,lastName,email,gravatar'}).then(res => {
                    return res.getData();
                });
            },
            onSubmit: (model, container) => {
                container.showLoading();
                return container.api.patch('/me', model).then(apiResponse => {
                    container.hideLoading();
                    if (apiResponse.isError()) {
                        return container.handleApiError(apiResponse);
                    }

                    container.setModel({password: null, confirmPassword: null});
                    this.dispatch('Acl.Account.Refresh');
                    Webiny.Growl.success('Account settings were saved!');
                });
            }
        };

        return (
            <Ui.Form ui="myForm" {...this.props.configureContainer(formContainer)}>
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header title="Account Settings"/>
                        <Ui.View.Body>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col md={6} sm={12}>
                                    <Ui.Form.Fieldset title="Your account"/>
                                    <Ui.Input label="First name" name="firstName" validate="required"/>
                                    <Ui.Input label="Last name" name="lastName" validate="required"/>
                                    <Ui.Input label="Email" name="email" validate="required,email"/>

                                    <div className="form-group">
                                        <label className="control-label">Gravatar</label>

                                        <div className="input-group">
                                            <Ui.Gravatar hash={model.gravatar} size={100}/>
                                        </div>
                                    </div>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col md={6} sm={12}>
                                    <Ui.Form.Fieldset title="Reset password"/>
                                    <Ui.Input
                                        label="New password"
                                        name="password"
                                        type="password"
                                        validate="password"
                                        placeholder="Type your new password"/>
                                    <Ui.Input
                                        label="Confirm password"
                                        name="confirmPassword"
                                        type="password"
                                        validate="eq:@password"
                                        placeholder="Re-type your new password">
                                        <validator name="eq">Passwords do not match</validator>
                                    </Ui.Input>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </Ui.View.Body>
                        <Ui.View.Footer align="right">
                            <Ui.Button type="primary" onClick={container.submit} label="Save account"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form>
        );
    }
};

export default UsersAccount;