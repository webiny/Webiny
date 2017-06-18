import Webiny from 'Webiny';

class Form extends Webiny.Ui.View {
}

Form.defaultProps = {
    renderer() {
        const formProps = {
            api: Webiny.Auth.getApiEndpoint(),
            fields: 'id,firstName,lastName,email,roles,enabled',
            connectToRouter: true,
            onSubmitSuccess: 'Users.List',
            onCancel: 'Users.List',
            onSuccessMessage: (record) => {
                return <span>User <strong>{record.firstName}</strong> was saved successfully!</span>;
            }
        };

        return (
            <Webiny.Ui.LazyLoad modules={['View', 'Form', 'Grid', 'Tabs', 'Input', 'Switch', 'Button', {UserRoles: 'Webiny/Backend/UserRoles'}]}>
                {(Ui) => (
                    <Ui.Form {...formProps}>
                        {(model, form) => (
                            <Ui.View.Form>
                                <Ui.View.Header title={model.id ? 'ACL - Edit User' : 'ACL - Create User'}/>
                                <Ui.Form.Error message="Something went wrong during save"/>
                                <Ui.View.Body noPadding>
                                    <Ui.Tabs size="large">
                                        <Ui.Tabs.Tab label="General" icon="fa-user">
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.Input label="First name" name="firstName" validate="required"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.Input label="Last name" name="lastName" validate="required"/>
                                                </Ui.Grid.Col>
                                                <Ui.Grid.Col all={6}>
                                                    <Ui.Input
                                                        label="Email"
                                                        name="email"
                                                        description="Your email"
                                                        validate="required,email"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.Grid.Row>
                                                <Ui.Grid.Col all={12}>
                                                    <Ui.Switch label="Enabled" name="enabled"/>
                                                </Ui.Grid.Col>
                                            </Ui.Grid.Row>
                                            <Ui.UserRoles name="roles"/>
                                        </Ui.Tabs.Tab>
                                    </Ui.Tabs>
                                </Ui.View.Body>
                                <Ui.View.Footer>
                                    <Ui.Button type="default" onClick={form.cancel} label="Go back"/>
                                    <Ui.Button type="primary" onClick={form.submit} label="Save user" align="right"/>
                                </Ui.View.Footer>
                            </Ui.View.Form>
                        )}
                    </Ui.Form>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default Form;
