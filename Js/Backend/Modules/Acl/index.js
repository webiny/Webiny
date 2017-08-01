import Webiny from 'webiny';
import Views from './Views/Views';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'Acl';
        const Menu = Webiny.Ui.Menu;

        const aclManageUsers = 'webiny-acl-user-manager';
        const aclApiTokens = 'webiny-acl-api-token-manager';

        this.registerMenus(
            new Menu('ACL', [
                new Menu('User Management', [
                    new Menu('Users', 'Users.List'),
                    new Menu('Roles', 'UserRoles.List'),
                    new Menu('Permissions', 'UserPermissions.List')
                ]).setRole(aclManageUsers),
                new Menu('API', [
                    new Menu('Tokens', 'ApiTokens.List'),
                    new Menu('Request Logs', 'ApiLogs.List')
                ]).setRole(aclApiTokens)
            ], 'icon-users')
        );

        this.registerRoutes(
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
            new Webiny.Route('ApiLogs.List', '/acl/api-logs', Views.ApiLogsList, 'ACL - API Logs').setRole(aclApiTokens)
        );
    }
}

export default Module;