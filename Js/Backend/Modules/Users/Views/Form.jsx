import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class Form extends Webiny.Ui.View {

    render() {
        const containerProps = {
            api: '/core/users',
            fields: 'id,firstName,lastName,email,userGroups,settings,enabled',
            title: 'Users form',
            onSubmitSuccess: () => {
                Webiny.Router.goToRoute('Users.List')
            },
            onCancel: () => {
                Webiny.Router.goToRoute('Users.List')
            }
        };

        return (
            <Webiny.Builder.View name="core-users-form">
                <Ui.Form.Container ui="myForm" {...containerProps}>
                    <Ui.Form.Form>
                        <fields>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Input label="First name" name="firstName" validate="required"/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Input label="Last name" name="lastName" validate="required"/>
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Input label="Email" name="email" validate="required,email"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
                                    <Ui.Switch label="Enabled" name="enabled"/>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </fields>
                        <actions>
                            <Ui.Button type="default" onClick={this.ui('myForm:cancel')} label="Cancel"/>
                            <Ui.Button type="secondary" onClick={this.ui('myForm:reset')} label="Reset"/>
                            <Ui.Button type="primary" onClick={this.ui('myForm:submit')} label="Submit"/>
                        </actions>
                    </Ui.Form.Form>
                </Ui.Form.Container>
            </Webiny.Builder.View>
        );
    }
}

export default Form;
