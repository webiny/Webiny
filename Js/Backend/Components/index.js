import Webiny from 'Webiny';

Webiny.registerModule(
    new Webiny.Module('Webiny/Backend/UserRoles', () => import('./UserRoles')),
    new Webiny.Module('Webiny/Backend/UserPermissions', () => import('./UserPermissions'))
);