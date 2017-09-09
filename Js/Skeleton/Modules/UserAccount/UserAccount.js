import React from 'react';
import Webiny from 'webiny';
import TwoFactorAuthConfirmation from './Components/TwoFactorAuthConfirmation';

class UserAccount extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('twoFactorAuthModal');
    }

    twoFactorAuthModal(confirm, cancel, dialog) {
        const {Ui} = this.props;

        const formProps = {
            api: '/entities/webiny/user/2factor-verify',
            fields: 'id,title',
            onSuccessMessage: null,
            onSubmitSuccess: (apiResponse) => {
                if (apiResponse.getData().result) {
                    confirm();
                } else {
                    Webiny.Growl.danger('The code doesn\'t match');
                }
            }
        };

        return (
            <Ui.Modal.Dialog>
                <Ui.Form {...formProps}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Modal.Header title="2 Factor Auth" onClose={cancel}/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Section title="Step 1"/>
                                        <p>
                                            Install the Google Authenticator iOS or Android app: <br/>
                                        </p>
                                        <p>
                                            <Ui.Link url="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">
                                                <Ui.Icon icon="fa-apple"/> iOS download
                                            </Ui.Link>
                                            <br/>
                                            <Ui.Link
                                                url="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en">
                                                <Ui.Icon icon="fa-android"/> Android download
                                            </Ui.Link>
                                        </p>
                                    </Ui.Grid.Col>

                                    <Ui.Grid.Col all={6}>
                                        <Ui.Section title="Step 2"/>
                                        <p>Scan the QR code below with the authenticator app</p>
                                        <Ui.Data api="/entities/webiny/user/2factor-qr" waitForData={true}>
                                            {(data, filter, loader) => {
                                                if (loader) {
                                                    return loader;
                                                }
                                                return (
                                                    <Ui.Grid.Col all={12} className="text-center">
                                                        <img src={data.qrCode}/>
                                                    </Ui.Grid.Col>
                                                );
                                            }}
                                        </Ui.Data>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Section title="Step 3"/>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input label="Enter the generated code in the field below:" name="verification"
                                                      validate="required"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Col>

                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer>
                                <Ui.Button type="default" label="Cancel" onClick={cancel}/>
                                <Ui.Button type="primary" label="Verify" onClick={form.submit}/>
                            </Ui.Modal.Footer>
                        </Ui.Modal.Content>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>

        );
    }

}

UserAccount.defaultProps = {
    renderer() {
        const formContainer = {
            api: Webiny.Auth.getApiEndpoint(),
            loadModel: (form) => {
                form.showLoading();
                return form.api.get('/me', {_fields: 'id,firstName,lastName,email,gravatar,twoFactorAuth.status'}).then(res => {
                    form.hideLoading();
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
                    Webiny.Growl.success('Account settings were saved!');
                    Webiny.Auth.refresh();
                });
            }
        };

        const {Ui} = this.props;

        return (
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
                                        placeholder="Type your new password"/>
                                    <Ui.Password
                                        label="Confirm password"
                                        name="confirmPassword"
                                        validate="eq:@password"
                                        placeholder="Re-type your new password">
                                        <validator name="eq">Passwords do not match</validator>
                                    </Ui.Password>

                                    <Ui.ChangeConfirm message={value => value ? 'Dummy' : null}
                                                      renderDialog={this.twoFactorAuthModal}
                                                      onComplete={() => this.twoFactorAuthConfirmation.show()}>
                                        <Ui.Switch label="Enable 2 Factor Authentication" name="twoFactorAuth.status"/>
                                    </Ui.ChangeConfirm>
                                    <TwoFactorAuthConfirmation ref={ref => this.twoFactorAuthConfirmation = ref}/>

                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </Ui.View.Body>
                        <Ui.View.Footer align="right">
                            <Ui.Button type="primary" onClick={form.submit} label="Save account"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form>
        );
    }
};

export default Webiny.createComponent(UserAccount, {
    modulesProp: 'Ui',
    modules: ['View', 'Form', 'Grid', 'Gravatar', 'Input', 'Password', 'Button', 'Section', 'ChangeConfirm', 'Switch', 'Modal', 'Data', 'Link', 'Icon']
});