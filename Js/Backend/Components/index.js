import Webiny from 'Webiny';

Webiny.registerModule({
    'Webiny/Backend/UserRoles': () => import('./UserRoles'),
    'Webiny/Backend/UserPermissions': () => import('./UserPermissions')
});