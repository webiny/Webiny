import Webiny from 'webiny';

Webiny.registerModule(
    new Webiny.Module('Webiny/Backend/UserRoles', () => import('./UserRoles')),
    new Webiny.Module('Webiny/Backend/UserPermissions', () => import('./UserPermissions'))
);