import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer: function render() {
        const listProps = {
            api: '/entities/core/user-permissions',
            fields: 'id,name,slug,createdOn,description',
            connectToRouter: true,
            query: {_sort: 'name'},
            searchFields: 'name,slug',
            perPage: 25
        };

        const rolesLink = <Ui.Link route="UserRoles.List">Roles</Ui.Link>;

        return (
            <Ui.View.List>
                <Ui.View.Header
                    title="ACL - Permissions"
                    description={<span>Permissions define what a user is allowed to do with entities and services. Define permissions and then group them into {rolesLink}.</span>}>
                    <Ui.Link type="primary" route="UserPermissions.Create" align="right">
                        <Ui.Icon icon="icon-plus-circled"/>
                        Create permission
                    </Ui.Link>
                </Ui.View.Header>
                <Ui.View.Body>
                    <Ui.List {...listProps}>
                        <Ui.List.FormFilters>
                            {(apply) => (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input
                                            name="_searchQuery"
                                            placeholder="Search by name or slug"
                                            onEnter={apply()}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            )}
                        </Ui.List.FormFilters>
                        <Table>
                            <Table.Row>
                                <Table.Field name="name" label="Name" sort="name">
                                    {data => (
                                        <span>
                                            <Ui.Link route="UserPermissions.Edit" params={{id: data.id}}>
                                                <strong>{data.name}</strong>
                                            </Ui.Link>
                                            <br/>
                                            {data.description}
                                        </span>
                                    )}
                                </Table.Field>
                                <Table.Field name="slug" label="Slug" sort="slug"/>
                                <Table.Actions>
                                    <Table.EditAction route="UserPermissions.Edit"/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                        </Table>
                        <Ui.List.Pagination/>
                    </Ui.List>
                </Ui.View.Body>
            </Ui.View.List>
        );
    }
};

export default List;