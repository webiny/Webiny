import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace Webiny.Skeleton.Layout.UserMenu.AccountPreferencesMenu
 */
const AccountPreferencesMenu = (props) => {
    const {Link} = props;
    return (
        <user-menu-item>
            <Link route="Users.Account">{this.i18n('Account preferences')}</Link>
            <span>{this.i18n('Set your account and user preferences')} </span>
        </user-menu-item>
    );
};

export default Webiny.createComponent(AccountPreferencesMenu, {modules: ['Link']});