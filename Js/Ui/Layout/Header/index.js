import React from 'react';
import $ from 'jquery';
import Webiny from 'webiny';

class Header extends Webiny.Ui.Component {

    toggleMobile() {
        $('body').toggleClass('opened-mobile-nav');
    }

    render() {
        const {userMenu, logo} = this.props;
        return (
            <div className="navbar navbar-inverse" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="nav" data-toggle="collapse" data-target=".navbar-collapse" onClick={this.toggleMobile}>
                        <span/><span/><span/>
                    </button>
                    {logo && (React.isValidElement(logo) ? logo : React.createElement(logo))}
                    {userMenu && (React.isValidElement(userMenu) ? userMenu : React.createElement(userMenu))}
                </div>
            </div>
        );
    }
}

export default Webiny.createComponent(Header, {
    modules: [{
        userMenu: 'Webiny/Layout/UserMenu',
        logo: 'Webiny/Layout/Logo'
    }]
});