import Webiny from 'Webiny';
import Views from './Views/Views';

class Acl extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        const aclManageUsers = 'core-acl-user-manager';
        const aclApiTokens = 'core-acl-api-token-manager';

        this.registerMenus(
            new Menu('ACL', [
                new Menu('User Management', [
                    new Menu('Users', 'Users.List'),
                    new Menu('Roles', 'UserRoles.List'),
                    new Menu('Permissions', 'UserPermissions.List')
                ]).setRole(aclManageUsers),
                new Menu('API Tokens', 'ApiTokens.List').setRole(aclApiTokens)
            ], 'icon-users')
        );

        this.registerRoutes(
            new Webiny.Route('Users.Account', '/acl/users/account', Views.UsersAccount, 'Account Settings'),
            new Webiny.Route('Users.Create', '/acl/users/new', Views.UsersForm, 'ACL - Create User').setRole(aclManageUsers),
            new Webiny.Route('Users.Edit', '/acl/users/:id', Views.UsersForm, 'ACL - Edit User').setRole(aclManageUsers),
            new Webiny.Route('Users.List', '/acl/users', Views.UsersList, 'ACL - Users').setRole(aclManageUsers),
            new Webiny.Route('UserRoles.Create', '/acl/roles/new', Views.UserRolesForm, 'ACL - Create Role').setRole(aclManageUsers),
            new Webiny.Route('UserRoles.Edit', '/acl/roles/:id', Views.UserRolesForm, 'ACL - Edit Role').setRole(aclManageUsers),
            new Webiny.Route('UserRoles.List', '/acl/roles', Views.UserRolesList, 'ACL - Roles').setRole(aclManageUsers),
            new Webiny.Route('UserPermissions.Create', '/acl/permissions/new', Views.UserPermissionsForm, 'ACL - Create Permission').setRole(aclManageUsers),
            new Webiny.Route('UserPermissions.Edit', '/acl/permissions/:id', Views.UserPermissionsForm, 'ACL - Edit Permission').setRole(aclManageUsers),
            new Webiny.Route('UserPermissions.List', '/acl/permissions', Views.UserPermissionsList, 'ACL - Permissions').setRole(aclManageUsers),
            new Webiny.Route('ApiTokens.List', '/acl/api-tokens', Views.ApiTokensList, 'ACL - API Tokens').setRole(aclApiTokens),
            new Webiny.Route('ApiTokens.Logs', '/acl/api-tokens/logs/:token', Views.ApiTokensLogs, 'ACL - API Tokens - Logs').setRole(aclApiTokens)
        );

        Webiny.Dispatcher.on('Acl.Account.Refresh', () => {
            Webiny.Auth.getUser();
        });
    }
}

export default Acl;