import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('ACL', [
                new Menu('User Management', [
                    new Menu('Users', 'Users.List'),
                    new Menu('Roles', 'UserRoles.List'),
                    new Menu('Permissions', 'UserPermissions.List')
                ]).setRole('acl-manage-users'),
                new Menu('API Tokens', 'ApiTokens.List').setRole('acl-manage-api-tokens')
            ], 'icon-users')
        );

        this.registerRoutes(
            new Webiny.Route('Users.Account', '/acl/users/account', Views.UsersAccount, 'Account Settings'),
            new Webiny.Route('Users.Create', '/acl/users/new', Views.UsersForm, 'ACL - Create User'),
            new Webiny.Route('Users.Edit', '/acl/users/:id', Views.UsersForm, 'ACL - Edit User'),
            new Webiny.Route('Users.List', '/acl/users', Views.UsersList, 'ACL - Users'),
            new Webiny.Route('UserRoles.Create', '/acl/roles/new', Views.UserRolesForm, 'ACL - Create Role'),
            new Webiny.Route('UserRoles.Edit', '/acl/roles/:id', Views.UserRolesForm, 'ACL - Edit Role'),
            new Webiny.Route('UserRoles.List', '/acl/roles', Views.UserRolesList, 'ACL - Roles'),
            new Webiny.Route('UserPermissions.Create', '/acl/permissions/new', Views.UserPermissionsForm, 'ACL - Create Permission'),
            new Webiny.Route('UserPermissions.Edit', '/acl/permissions/:id', Views.UserPermissionsForm, 'ACL - Edit Permission'),
            new Webiny.Route('UserPermissions.List', '/acl/permissions', Views.UserPermissionsList, 'ACL - Permissions'),
            new Webiny.Route('ApiTokens.List', '/acl/api-tokens', Views.ApiTokensList, 'ACL - API Tokens')
        );

        Webiny.Dispatcher.on('Acl.Account.Refresh', () => {
            return new Webiny.Api.Endpoint('/entities/core/users').get('/me').then(res => {
                Webiny.Model.set('User', res.getData());
                return res;
            });
        });
    }
}

export default Module;