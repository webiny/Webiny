import React from 'react';
import Webiny from 'webiny';

class Form extends Webiny.Ui.View {
}

Form.defaultProps = {
    renderer() {
        const formProps = {
            api: Webiny.Auth.getApiEndpoint(),
            fields: 'id,firstName,lastName,email,roles,roleGroups,enabled',
            connectToRouter: true,
            onSubmitSuccess: () => {
                Webiny.Auth.refresh();
                Webiny.Router.goToRoute('Users.List');
            },
            onCancel: 'Users.List',
            onSuccessMessage: (record) => {
                return <span>User <strong>{record.firstName}</strong> was saved successfully!</span>;
            }
        };

        const {Ui} = this.props;

        return (
            <Ui.Form {...formProps}>
                {(model, form) => (
                    <Ui.View.Form>
                        <Ui.View.Header title={model.id ? 'ACL - Edit User' : 'ACL - Create User'}/>
                        <Ui.Form.Error message="Something went wrong during save"/>
                        <Ui.View.Body>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Section title="Info"/>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input label="First name" name="firstName" validate="required"/>
                                            <Ui.Input label="Last name" name="lastName" validate="required"/>
                                            <Ui.Input
                                                label="Email"
                                                name="email"
                                                description="Your email"
                                                validate="required,email"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Section title="Password"/>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Password
                                                label="New password"
                                                name="password"
                                                placeholder="Type a new password"/>
                                            <Ui.Password
                                                label="Confirm password"
                                                name="confirmPassword"
                                                validate="eq:@password"
                                                placeholder="Retype the new password">
                                                <validator name="eq">Passwords do not match</validator>
                                            </Ui.Password>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Switch label="Enabled" name="enabled"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Tabs>
                                        <Ui.Tabs.Tab label="Roles" icon="fa-user">
                                            <Ui.UserRoles name="roles"/>
                                        </Ui.Tabs.Tab>
                                        <Ui.Tabs.Tab label="Role Groups" icon="fa-users">
                                            <Ui.UserRoleGroups name="roleGroups"/>
                                        </Ui.Tabs.Tab>
                                    </Ui.Tabs>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button type="default" onClick={form.cancel} label="Go back"/>
                            <Ui.Button type="primary" onClick={form.submit} label="Save user" align="right"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form>
        );
    }
};

export default Webiny.createComponent(Form, {
    modulesProp: 'Ui',
    modules: ['View', 'Form', 'Grid', 'Tabs', 'Input', 'Password', 'Switch', 'Button', 'Section', {
        UserRoles: 'Webiny/Backend/UserRoles',
        UserRoleGroups: 'Webiny/Backend/UserRoleGroups'
    }]
});
