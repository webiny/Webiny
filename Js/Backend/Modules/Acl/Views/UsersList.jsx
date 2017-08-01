import React from 'react';
import Webiny from 'webiny';

class List extends Webiny.Ui.View {

}

List.defaultProps = {
    renderer() {
        const listProps = {
            api: '/entities/webiny/users',
            fields: 'id,enabled,firstName,lastName,email,createdOn,gravatar',
            connectToRouter: true,
            searchFields: 'firstName,lastName,email'
        };

        const {View, List, Link, Icon, Input} = this.props;
        const Table = List.Table;

        const roles = <Link route="UserRoles.List">Roles</Link>;
        const permissions = <Link route="UserPermissions.List">Permissions</Link>;

        return (
            <View.List>
                <View.Header
                    title="ACL - Users"
                    description={<span>Once your system {permissions} and {roles}&nbsp;are defined,
                        you can create your system users here.</span>}>
                    <Link type="primary" route="Users.Create" align="right">
                        <Icon icon="icon-plus-circled"/>
                        Create user
                    </Link>
                </View.Header>
                <View.Body>
                    <List {...listProps}>
                        <List.FormFilters>
                            {(applyFilters) => (
                                <Input
                                    name="_searchQuery"
                                    placeholder="Search by name or email"
                                    onEnter={applyFilters()}/>
                            )}
                        </List.FormFilters>
                        <Table>
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
                                    message={() => {
                                        this.i18n('This will disable user\'s account and prevent him from logging in!');
                                    }}/>
                                <Table.DateField name="createdOn" label="Created On" sort="createdOn"/>
                                <Table.Actions>
                                    <Table.EditAction route="Users.Edit"/>
                                    <Table.DeleteAction/>
                                </Table.Actions>
                            </Table.Row>
                            <Table.Footer/>
                        </Table>
                        <List.Pagination/>
                    </List>
                </View.Body>
            </View.List>
        );
    }
};

export default Webiny.createComponent(List, {
    modules: ['View', 'List', 'Link', 'Icon', 'Input']
});