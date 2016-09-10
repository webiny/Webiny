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
            connectToRouter: true,
            searchFields: 'firstName,lastName,email'
        };

        const roles = <Ui.Link route="UserRoles.List">Roles</Ui.Link>;
        const permissions = <Ui.Link route="UserPermissions.List">Permissions</Ui.Link>;

        return (
            <Ui.View.List>
                <Ui.View.Header
                    title="ACL - Users"
                    description={<span>Once your system {permissions} and {roles} are defined, you can create your system users here.</span>}>
                    <Ui.Link type="primary" route="Users.Create" align="right">
                        <Ui.Icon icon="icon-plus-circled"/>
                        Create user
                    </Ui.Link>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.List.ApiContainer {...listProps}>
                        <Ui.List.FormFilters>
                            {(applyFilters) => (
                                <Ui.Input
                                    name="_searchQuery"
                                    placeholder="Search by name or email"
                                    onEnter={applyFilters()}/>
                            )}
                        </Ui.List.FormFilters>
                        <Table.Table>
                            <Table.Row>
                                <Table.GravatarField name="gravatar"/>
                                <Table.Field name="firstName" label="First Name" sort="firstName" route="Users.Edit">
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
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default List;