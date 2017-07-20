import React from 'react';
import Webiny from 'Webiny';

class UsersAccount extends Webiny.Ui.View {

}

UsersAccount.defaultProps = {
    renderer() {
        const formContainer = {
            api: Webiny.Auth.getApiEndpoint(),
            loadModel: (form) => {
                return form.api.get('/me', {_fields: 'id,firstName,lastName,email,gravatar'}).then(res => {
                    return res.getData();
                });
            },
            onSubmit: (model, form) => {
                form.showLoading();
                return form.api.patch('/me', model).then(apiResponse => {
                    form.hideLoading();
                    if (apiResponse.isError()) {
                        return form.handleApiError(apiResponse);
                    }

                    form.setModel({password: null, confirmPassword: null});
                    this.dispatch('Acl.Account.Refresh');
                    Webiny.Growl.success('Account settings were saved!');
                });
            }
        };

        return (
            <Webiny.Ui.LazyLoad modules={['View', 'Form', 'Grid', 'Gravatar', 'Input', 'Password', 'Button', 'Section']}>
                {(Ui) => (
                    <Ui.Form {...formContainer}>
                        {(model, form) => (
                            <Ui.View.Form>
                                <Ui.View.Header title="Account Settings"/>
                                <Ui.View.Body>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col md={6} sm={12}>
                                            <Ui.Section title="Your account"/>
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
                                            <Ui.Section title="Reset password"/>
                                            <Ui.Password
                                                label="New password"
                                                name="password"
                                                validate="minLength:8"
                                                placeholder="Type your new password"/>
                                            <Ui.Password
                                                label="Confirm password"
                                                name="confirmPassword"
                                                validate="eq:@password"
                                                placeholder="Re-type your new password">
                                                <validator name="eq">Passwords do not match</validator>
                                            </Ui.Password>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.View.Body>
                                <Ui.View.Footer align="right">
                                    <Ui.Button type="primary" onClick={form.submit} label="Save account"/>
                                </Ui.View.Footer>
                            </Ui.View.Form>
                        )}
                    </Ui.Form>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default UsersAccount;