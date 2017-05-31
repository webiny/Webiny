import Webiny from 'Webiny';

Webiny.registerModule({
    'Core/Backend/UserRoles': () => import('./UserRoles'),
    'Core/Backend/UserPermissions': () => import('./UserPermissions')
});