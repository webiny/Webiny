import Webiny from 'webiny';

export default () => {
    Webiny.registerModule(
        new Webiny.Module('Webiny/Layout/Header', () => import('./Header')),
        new Webiny.Module('Webiny/Layout/AppNotifications', () => import('./AppNotifications')),
        new Webiny.Module('Webiny/Layout/Logo', () => import('./Logo')),
        new Webiny.Module('Webiny/Layout/Navigation', () => import('./Navigation')),
        new Webiny.Module('Webiny/Layout/Navigation/Desktop', () => import('./Navigation/Desktop')),
        new Webiny.Module('Webiny/Layout/Navigation/Mobile', () => import('./Navigation/Mobile')),
        new Webiny.Module('Webiny/Layout/UserMenu', () => import('./UserMenu')),
    );
};