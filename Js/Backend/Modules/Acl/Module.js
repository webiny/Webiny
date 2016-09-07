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
                ]),
                new Menu('API Tokens', 'ApiTokens.List')
            ], 'icon-users')
        );

        this.registerRoutes(
            new Webiny.Route('Users.Account', '/acl/users/account', Views.UsersAccount, 'Account Settings'),
            new Webiny.Route('Users.Create', '/acl/users/new', Views.UsersForm, 'Create User'),
            new Webiny.Route('Users.Edit', '/acl/users/:id', Views.UsersForm, 'Edit User'),
            new Webiny.Route('Users.List', '/acl/users', Views.UsersList, 'Users'),
            new Webiny.Route('UserRoles.Create', '/acl/roles/new', Views.UserRolesForm, 'New User Role'),
            new Webiny.Route('UserRoles.Edit', '/acl/roles/:id', Views.UserRolesForm, 'Edit User Role'),
            new Webiny.Route('UserRoles.List', '/acl/roles', Views.UserRolesList, 'User Roles'),
            new Webiny.Route('UserPermissions.Create', '/acl/permissions/new', Views.UserPermissionsForm, 'New User Permission'),
            new Webiny.Route('UserPermissions.Edit', '/acl/permissions/:id', Views.UserPermissionsForm, 'Edit User Permission'),
            new Webiny.Route('UserPermissions.List', '/acl/permissions', Views.UserPermissionsList, 'User Permissions'),
            new Webiny.Route('ApiTokens.List', '/acl/api-tokens', Views.ApiTokensList, 'API Tokens')
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