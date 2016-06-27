import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('ACL', [
                new Menu('Users', 'Users.List'),
                new Menu('User Groups', 'UserGroups.List')
            ], 'icon-users')
        );

        this.registerRoutes(
            new Webiny.Route('Users.Account', '/acl/users/account', Views.UsersAccount, 'Account Settings'),
            new Webiny.Route('Users.Create', '/acl/users/new', Views.UsersForm, 'Create User'),
            new Webiny.Route('Users.Edit', '/acl/users/:id', Views.UsersForm, 'Edit User'),
            new Webiny.Route('Users.List', '/acl/users', Views.UsersList, 'Users'),
            new Webiny.Route('UserGroups.Create', '/acl/groups/new', Views.UserGroupsForm, 'New User Group'),
            new Webiny.Route('UserGroups.Edit', '/acl/groups/:id', Views.UserGroupsForm, 'Edit User Group'),
            new Webiny.Route('UserGroups.List', '/acl/groups', Views.UserGroupsList, 'User Groups')
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