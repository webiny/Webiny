/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class Form extends Webiny.Ui.View {

}

Form.defaultProps = {
    renderer() {
        const containerProps = {
            api: '/entities/core/users',
            fields: 'id,firstName,lastName,email,userGroups,enabled',
            connectToRouter: true,
            onSubmitSuccess: 'Users.List',
            onCancel: 'Users.List',
            onSuccessMessage: (record) => {
                return <span>User <strong>{record.firstName}</strong> was saved successfully!</span>;
            }
        };

        return (
            <Ui.Form.Container ui="myForm" {...containerProps}>
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header title={model.id ? 'Edit User' : 'Create User'}/>
                        <Ui.Form.Error message="Something went wrong during save"/>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs.Tabs>
                                <Ui.Tabs.Tab label="General">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="First name" name="firstName" validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Last name" name="lastName" validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Email" name="email" description="Your email" validate="required,email"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Switch label="Enabled" name="enabled"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button type="default" onClick={container.cancel} label="Go back"/>
                            <Ui.Button type="primary" onClick={container.submit} label="Save" align="right"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form.Container>
        );
    }
};

export default Form;
