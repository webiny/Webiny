import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer: function render() {
        const listProps = {
            api: '/entities/core/user-roles',
            fields: 'id,name,slug,description,createdOn',
            connectToRouter: true,
            query: {_sort: 'name'},
            searchFields: 'name,slug,description',
            perPage: 25
        };

        const users = <Ui.Link route="Users.List">Users</Ui.Link>;
        const permissions = <Ui.Link route="UserPermissions.List">Permissions</Ui.Link>;

        return (
            <Ui.View.List>
                <Ui.View.Header
                    title="ACL - Roles"
                    description={<span>Roles are a simple way to control what permissions certain users have. Create a role with a set of {permissions} and then assign roles to {users}.</span>}>
                    <Ui.Link type="primary" route="UserRoles.Create" align="right">
                        <Ui.Icon icon="icon-plus-circled"/>
                        Create role
                    </Ui.Link>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.List.ApiContainer {...listProps}>
                        <Ui.List.FormFilters>
                            {(apply, reset) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input
                                            name="_searchQuery"
                                            placeholder="Search by name, description or slug"
                                            onEnter={apply()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>
                        <Table.Table>
                            <Table.Row>
                                <Table.Field name="name" label="Name" sort="name">
                                    {data => (
                                        <span>
                                            <Ui.Link route="UserRoles.Edit" params={{id: data.id}}>
                                                <strong>{data.name}</strong>
                                            </Ui.Link>
                                            <br/>
                                            {data.description}
                                        </span>
                                    )}
                                </Table.Field>
                                <Table.Field name="slug" label="Slug" sort="slug"/>
                                <Table.Actions>
                                    <Table.EditAction route="UserRoles.Edit"/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                        </Table.Table>
                        <Ui.List.Pagination/>
                    </Ui.List.ApiContainer>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default List;