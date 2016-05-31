import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer: function render() {
        const listProps = {
            api: '/entities/core/users',
            fields: 'id,enabled,firstName,lastName,email,createdOn,gravatar',
            connectToRouter: true
        };

        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12}>
                    <h2>Users</h2>
                </Ui.Grid.Col>
                <Ui.List.ApiContainer ui="myList" {...listProps}>
                    <Table.Table>
                        <Table.Row>
                            <Table.GravatarField name="gravatar"/>
                            <Table.Field name="firstName" label="First Name" sort="firstName">
                                {data => (
                                    <span>
                                        <strong>{data.firstName} {data.lastName}</strong><br/>{data.id}
                                    </span>
                                )}
                            </Table.Field>
                            <Table.Field name="email" sort="email" label="Email"/>
                            <Table.ToggleField
                                name="enabled"
                                label="Status"
                                sort="enabled"
                                align="center"
                                message={() => {this.i18n('This will disable user\'s account and prevent him from logging in!');}}/>
                            <Table.DateField name="createdOn" label="Created On" sort="createdOn"/>
                            <Table.Actions>
                                <Table.EditAction route="Users.Edit"/>
                                <Table.DeleteAction/>
                            </Table.Actions>
                        </Table.Row>
                        <Table.Footer/>
                    </Table.Table>
                    <Ui.List.Pagination/>
                </Ui.List.ApiContainer>
            </Ui.Grid.Row>
        );
    }
};

export default List;