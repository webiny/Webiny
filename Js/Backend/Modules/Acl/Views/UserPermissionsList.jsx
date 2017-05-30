import Webiny from 'Webiny';
import ExportPermissionModal from './Modal/ExportPermissionModal';

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer() {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'Link', 'View', 'List', 'Icon', 'Grid', 'Input']}>
                {(Ui) => {
                    const Table = Ui.List.Table;
                    const listProps = {
                        api: '/entities/webiny/user-permissions',
                        fields: 'id,name,slug,createdOn,description',
                        connectToRouter: true,
                        query: {_sort: 'name'},
                        searchFields: 'name,slug',
                        perPage: 25
                    };

                    const rolesLink = <Ui.Link route="UserRoles.List">Roles</Ui.Link>;

                    return (
                        <Ui.ViewSwitcher>
                            <Ui.ViewSwitcher.View view="pageCacheViewView" defaultView>
                                {showView => (
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
                                {(showView, data) => <ExportPermissionModal permission={data}/>}
                            </Ui.ViewSwitcher.View>
                        </Ui.ViewSwitcher>
                    );
                }}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default List;