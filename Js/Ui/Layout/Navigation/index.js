import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import Webiny from 'webiny';

/**
 * Note: this class needs to be optimized. The handling of mobile menu is just awful, a lot of (ughh) jquery code which needs to go out.
 * For now it does the job, but once we have more time we'll clean it up.
 */
class Navigation extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            menu: null,
            submenu: null,
            display: window.outerWidth > 768 ? 'desktop' : 'mobile'
        };

        this.checkDisplayInterval = null;
        this.offRouteChanged = _.noop;
        this.bindMethods('renderMainMenu,renderSubMenu,renderSubMenuItem,mainMenuItemClick,openSubMenu,closeSubMenu,closeMobileMenu');
    }

    componentDidMount() {
        super.componentDidMount();
        this.watch('User', data => {
            this.setState({user: data});
        });

        this.offRouteChanged = Webiny.Router.onRouteChanged(event => {
            this.setState({route: event.route.name});
        });

        this.checkDisplayInterval = setInterval(() => {
            this.setState({display: window.outerWidth > 768 ? 'desktop' : 'mobile'});
        }, 500);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.checkDisplayInterval);
        this.offRouteChanged();
    }

    shouldComponentUpdate(nextProps, nextState){
        return !_.isEqual(this.state, nextState);
    }

    getLink(route, linkProps = {}) {
        const {Link} = this.props;
        route = _.isString(route) ? route : null;

        if (route && route.indexOf(Webiny.Router.getBaseUrl()) === 0) {
            linkProps.url = route;
        } else {
            linkProps.route = route;
        }

        if (!linkProps.children) {
            linkProps.children = linkProps.label;
        }

        return <Link {...linkProps}/>;
    }

    mainMenuItemClick(menu) {
        const submenu = _.isString(menu.route) || _.isNull(menu.route) ? null : menu.key;
        this.openSubMenu(menu.key);
        if (this.state.submenu === menu.key) {
            return;
        }
        this.setState({submenu});
    }

    findRoute(menu, routeName) {
        if (_.isString(menu.route)) {
            return menu.route === routeName;
        }

        let active = false;
        _.each(menu.route, r => {
            if (this.findRoute(r, routeName)) {
                active = true;
            }
        });

        return active;
    }

    canAccess(menu) {
        if (!Webiny.Config.Js.CheckUserRoles) {
            return true;
        }

        const {user} = this.state;
        if (menu.role && menu.role.length && (!user || !_.find(user.roles, (r) => menu.role.indexOf(r.slug) > -1))) {
            return false;
        }
        return true;
    }

    renderMainMenu(menu) {
        const menuIconClass = this.classSet('icon app-icon', {'fa': _.includes(menu.icon, 'fa-')}, menu.icon);
        const linkProps = {
            key: menu.key,
            label: menu.label,
            children: [
                <span key="icon" className={menuIconClass}/>,
                <span key="title" className="app-title">{menu.label}</span>,
                <span key="caret" className="icon-caret-down icon mobile-caret"/>
            ]
        };

        if (_.isArray(menu.route)) {
            linkProps['data-open-submenu'] = menu.key;
        }

        const active = this.findRoute(menu, Webiny.Router.getActiveRoute().getName()) ? 'active' : '';

        const click = () => {
            this.mainMenuItemClick(menu);
        };

        return (
            <li className={active} key={menu.key} onClick={click}>
                {this.getLink(menu.route, linkProps)}
            </li>
        );
    }

    renderSubMenu(menu) {
        let items = [];
        if (_.isFunction(menu.route)) {
            items = menu.route(menu);
        } else if (_.isArray(menu.route)) {
            items = menu.route;
        }

        if (items.length === 0) {
            return null;
        }

        const menuProps = {
            key: menu.key,
            className: menu.key === this.state.submenu ? 'subnavigation open' : 'subnavigation',
            'data-this-menu': menu.key
        };

        const subMenuItems = _.without(items.map(this.renderSubMenuItem), null);

        if (!subMenuItems.length) {
            return null;
        }

        return (
            <ul {...menuProps}>
                {subMenuItems}
            </ul>
        );
    }

    renderSubMenuItem(menu, index) {
        if (!this.canAccess(menu)) {
            return null;
        }
        const {Link} = this.props;
        const mainAction = this.getLink(menu.route, {key: index, label: menu.label});
        let secondaryAction = null;
        let caret = null;
        let items = null;
        let onClick = this.closeMobileMenu;

        if (menu.action) {
            const actionIcon = menu.action.icon || 'icon-plus-circled';
            const linkProps = {
                label: menu.action.label,
                route: menu.action.route,
                className: 'small quick-link',
                children: [
                    <span key="label">{menu.action.label}</span>,
                    <span key="icon" className={this.classSet('icon', actionIcon)}/>
                ]
            };
            secondaryAction = this.getLink(menu.action.route, linkProps);
        }

        if (_.isArray(menu.route)) {
            caret = <span className="icon icon-caret-down"/>;
            onClick = () => {
                this.openSubSubMenu(menu.key)
            };
            items = (
                <ul data-this-submenu={menu.key}>
                    {menu.route.map((i, key) => {
                        if (!this.canAccess(i)) {
                            return null;
                        }
                        return (
                            <li key={key}>
                                <Link route={i.route} onClick={this.closeMobileMenu}>{i.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        const active = '';

        return (
            <li key={index} className={active} onClick={onClick}>
                {mainAction}
                {secondaryAction}
                {caret}
                {items}
            </li>
        );
    }

    openSubMenu(key) {
        if (this.state.display !== 'mobile') {
            return;
        }
        $('.left-menu-submenu li[data-this-menu="' + key + '"]').addClass('open');
        $('.left-menu-submenu').addClass('active').show();
    }

    openSubSubMenu(key) {
        if (this.state.display !== 'mobile') {
            return;
        }
        $('.left-menu-submenu ul[data-this-submenu="' + key + '"]').toggleClass('active');
    }

    closeSubMenu() {
        if (this.state.display !== 'mobile') {
            return;
        }
        $('.left-menu-submenu li.subnavigation.open').removeClass('open');
        $('.left-menu-submenu').removeClass('active').hide();
    }

    closeMobileMenu() {
        if (this.state.display !== 'mobile') {
            return;
        }
        $('body').toggleClass('opened-mobile-nav');
    }
}

Navigation.defaultProps = {
    renderer() {
        const menus = Webiny.Menu.getMenu();
        const menu = [];
        _.each(menus, m => {
            if (this.canAccess(m)) {
                menu.push(this.renderMainMenu(m));
            }
        });

        const submenu = [];
        _.each(menus, m => {
            submenu.push(this.renderSubMenu(m));
        });

        // In case the submenu is empty and it is supposed to have submenu items - remove the main menu item
        _.each(submenu, (s, index) => {
            if (!s && !_.isString(menus[index].route)) {
                menu[index] = null;
            }
        });

        return (
            <div className="master-navigation">
                <Webiny.Ui.Placeholder name="Header"/>

                <div className="navbar-collapse collapse" id="left-sidebar">
                    <div className="shield"/>
                    <div className="left-menu">
                        <div className="left-menu--close" onClick={this.closeMobileMenu}>Close</div>
                        <ul className="nav navbar-nav navbar-right">
                            {menu}
                        </ul>
                    </div>

                    <div className="left-menu-submenu" style={{display: this.state.submenu ? 'block' : 'none'}}>
                        <div>
                            <div className="left-menu-submenu--back" onClick={this.closeSubMenu}>Go Back</div>
                            {submenu}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Navigation, {modules: ['Link']});
