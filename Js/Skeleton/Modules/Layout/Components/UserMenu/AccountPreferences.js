import React from 'react';
import Webiny from 'webiny';

const AccountPreferencesMenu = (props) => {
    const {Link} = props;
    return (
        <user-menu-item>
            <Link route="Users.Account">Account preferences</Link>
            <span>Set your account and user preferences </span>
        </user-menu-item>
    );
};

export default Webiny.createComponent(AccountPreferencesMenu, {modules: ['Link']});