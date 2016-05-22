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
            new Webiny.Route('Users.Create', '/acl/users/new', Views.UsersForm),
            new Webiny.Route('Users.Edit', '/acl/users/:id', Views.UsersForm),
            new Webiny.Route('Users.List', '/acl/users', Views.UsersList),
            new Webiny.Route('UserGroups.Create', '/acl/groups/new', Views.UserGroupsForm),
            new Webiny.Route('UserGroups.Edit', '/acl/groups/:id', Views.UserGroupsForm),
            new Webiny.Route('UserGroups.List', '/acl/groups', Views.UserGroupsList)
        );
    }
}

export default Module;