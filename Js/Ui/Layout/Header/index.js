import React from 'react';
import $ from 'jquery';
import Webiny from 'webiny';
import logo from 'Webiny/Skeleton/Assets/images/logo.png';

class Header extends Webiny.Ui.Component {

    toggleMobile() {
        $('body').toggleClass('opened-mobile-nav');
    }

    render() {
        const {userMenu} = this.props;
        return (
            <div className="navbar navbar-inverse" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="nav" data-toggle="collapse" data-target=".navbar-collapse" onClick={this.toggleMobile}>
                        <span/><span/><span/>
                    </button>
                    <a href="#" className="logo">
                        <img src={logo} width="62" height="20" alt="Webiny"/>
                    </a>
                    {userMenu && (React.isValidElement(userMenu) ? userMenu : React.createElement(userMenu))}
                </div>
            </div>
        );
    }
}

export default Webiny.createComponent(Header, {
    modules: [{userMenu: 'Webiny/Layout/UserMenu'}]
});