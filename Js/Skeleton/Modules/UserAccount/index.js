import Webiny from 'webiny';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'UserAccount';

        this.registerRoutes(
            new Webiny.Route('Me.Notifications', '/me/notifications', () => Webiny.import('Webiny/Skeleton/Notifications'), 'My Notifications'),
            new Webiny.Route('Me.Account', '/me/account', () => Webiny.import('Webiny/Skeleton/UserAccount'), 'My Account')
        );

        Webiny.registerModule(
            new Webiny.Module('Webiny/Skeleton/UserAccount', () => import('./UserAccount')),
            new Webiny.Module('Webiny/Skeleton/Notifications', () => import('./Notifications')),
            new Webiny.Module('Webiny/Skeleton/Notification', () => import('./Components/Notification'))
        );
    }
}

export default Module;