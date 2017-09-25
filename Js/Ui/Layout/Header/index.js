import React, {createElement, isValidElement} from 'react';
import $ from 'jquery';
import Webiny from 'webiny';

class Header extends Webiny.Ui.Component {

    toggleMobile() {
        $('body').toggleClass('mobile-nav');
    }

    render() {
        const {userMenu, appNotifications, logo} = this.props;
        return (
            <div className="navbar navbar-inverse" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="nav" onClick={this.toggleMobile}>
                        <span/><span/><span/>
                    </button>
                    {logo && (isValidElement(logo) ? logo : createElement(logo))}
                    {userMenu && (isValidElement(userMenu) ? userMenu : createElement(userMenu))}
                    {/* appNotifications && (isValidElement(appNotifications) ? appNotifications : createElement(appNotifications)) */}
                </div>
            </div>
        );
    }
}

export default Webiny.createComponent(Header, {
    modules: [{
        appNotifications: 'Webiny/Layout/AppNotifications',
        userMenu: 'Webiny/Layout/UserMenu',
        logo: 'Webiny/Layout/Logo'
    }]
});