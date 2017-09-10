import React from 'react';
import Webiny from 'webiny';
import ExportRoleModal from './Modal/ExportRoleModal';
import ImportRoleModal from './Modal/ImportRoleModal';

class UserRolesList extends Webiny.Ui.View {
}

UserRolesList.defaultProps = {
    renderer() {
        const listProps = {
            ref: ref => this.list = ref,
            api: '/entities/webiny/user-roles',
            fields: 'id,name,slug,description,createdOn',
            connectToRouter: true,
            query: {_sort: 'name'},
            searchFields: 'name,slug,description',
            perPage: 25
        };

        const {Ui} = this.props;
        const Table = Ui.List.Table;

        const users = <Ui.Link route="Users.List">Users</Ui.Link>;
        const permissions = <Ui.Link route="UserPermissions.List">Permissions</Ui.Link>;
        return (
            <Ui.ViewSwitcher>
                <Ui.ViewSwitcher.View view="pageCacheViewView" defaultView>
                    {showView => (
                        <Ui.View.List>
                            <Ui.View.Header
                                title="ACL - Roles"
                                description={(
                                    <span>Roles are a simple way to control what permissions certain users have. Create a role with a set
                                        of {permissions} and then assign roles to {users}.</span>
                                )}>
                                <Ui.ButtonGroup>
                                    <Ui.Link type="primary" route="UserRoles.Create">
                                        <Ui.Icon icon="icon-plus-circled"/>
                                        Create
                                    </Ui.Link>
                                    <Ui.Button
                                        type="secondary"
                                        onClick={showView('importModal')}
                                        icon="fa-upload"
                                        label="Import"/>
                                </Ui.ButtonGroup>
                            </Ui.View.Header>
                            <Ui.View.Body>
                                <Ui.List {...listProps}>
                                    <Ui.List.FormFilters>
                                        {(apply) => (
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
                                    <Table>
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
                                                <Table.Action
                                                    label="Export"
                                                    icon="fa-download"
                                                    onClick={showView('exportModal')}/>
                                                <Table.DeleteAction/>
                                            </Table.Actions>
                                        </Table.Row>
                                    </Table>
                                    <Ui.List.Pagination/>
                                </Ui.List>
                            </Ui.View.Body>
                        </Ui.View.List>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="exportModal" modal>
                    {(showView, data) => <ExportRoleModal role={data} />}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="importModal" modal>
                    {(showView) => <ImportRoleModal onImported={() => this.list.loadData()}/>}
                </Ui.ViewSwitcher.View>
            </Ui.ViewSwitcher>
        );
    }
};

export default Webiny.createComponent(UserRolesList, {
    modulesProp: 'Ui',
    modules: ['ViewSwitcher', 'View', 'Link', 'Icon', 'Grid', 'Input', 'List', 'Button', 'ButtonGroup']
});