import React from 'react';
import Webiny from 'webiny';
import ExportModal from './Modal/ExportModal';
import ImportModal from './Modal/ImportModal';

class List extends Webiny.Ui.View {
}

List.defaultProps = {
    renderer() {
        const listProps = {
            ref: ref => this.list = ref,
            api: '/entities/webiny/user-role-groups',
            fields: 'id,name,slug,description,createdOn',
            connectToRouter: true,
            query: {_sort: 'name'},
            searchFields: 'name,slug,description',
            perPage: 25
        };

        const {Ui} = this.props;
        const Table = Ui.List.Table;

        const users = <Ui.Link route="Users.List">Users</Ui.Link>;
        const roles = <Ui.Link route="UserRoles.List">Roles</Ui.Link>;
        return (
            <Ui.ViewSwitcher>
                <Ui.ViewSwitcher.View view="listView" defaultView>
                    {showView => (
                        <Ui.View.List>
                            <Ui.View.Header
                                title="ACL - Role Groups"
                                description={(
                                    <span>Role Groups are a simple way to control what set of roles certain users have. Create a role group with a set
                                        of {roles} and then assign role groups to {users}.</span>
                                )}>
                                <Ui.ButtonGroup>
                                    <Ui.Link type="primary" route="UserRoleGroups.Create">
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
                                                        <Ui.Link route="UserRoleGroups.Edit" params={{id: data.id}}>
                                                            <strong>{data.name}</strong>
                                                        </Ui.Link>
                                                        <br/>
                                                        {data.description}
                                                    </span>
                                                )}
                                            </Table.Field>
                                            <Table.Field name="slug" label="Slug" sort="slug"/>
                                            <Table.Actions>
                                                <Table.EditAction route="UserRoleGroups.Edit"/>
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
                    {(showView, data) => (
                        <ExportModal
                            data={data}
                            map="roles"
                            api="/entities/webiny/user-role-groups"
                            fields="name,slug,description,roles"
                            label="Role Group"/>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="importModal" modal>
                    {(showView) => (
                        <ImportModal
                            api="/entities/webiny/user-role-groups"
                            label="Role Group"
                            onImported={() => this.list.loadData()}/>
                    )}
                </Ui.ViewSwitcher.View>
            </Ui.ViewSwitcher>
        );
    }
};

export default Webiny.createComponent(List, {
    modulesProp: 'Ui',
    modules: ['ViewSwitcher', 'View', 'Link', 'Icon', 'Grid', 'Input', 'List', 'Button', 'ButtonGroup']
});