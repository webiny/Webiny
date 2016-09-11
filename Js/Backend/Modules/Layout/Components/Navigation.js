import Webiny from 'Webiny';
const Link = Webiny.Ui.Components.Link;

class Navigation extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            menu: null,
            submenu: null
        };

        this.bindMethods('renderMainMenu,renderSubMenu,renderSubMenuItem,mainMenuItemClick');
    }

    componentDidMount() {
        super.componentDidMount();
        this.watch('User', () => {
            this.setState({time: new Date().getTime()})
        });
    }

    getLink(route, linkProps = {}) {
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
        if (!webinyConfig.CheckUserRoles) {
            return true;
        }

        const user = Webiny.Model.get('User');
        if (menu.role && (!user || !_.find(user.roles, {slug: menu.role}))) {
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
                <span key="icon" className={menuIconClass}></span>,
                <span key="title" className="app-title">{menu.label}</span>,
                <span key="caret" className="icon-caret-down icon mobile-caret"></span>
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
        const mainAction = this.getLink(menu.route, {key: index, label: menu.label});
        let secondaryAction = null;
        let caret = null;
        let items = null;

        if (menu.action) {
            const actionIcon = menu.action.icon || 'icon-plus-circled';
            const linkProps = {
                label: menu.action.label,
                route: menu.action.route,
                className: 'small quick-link',
                children: [
                    <span key="label">{menu.action.label}</span>,
                    <span key="icon" className={this.classSet('icon', actionIcon)}></span>
                ]
            };
            secondaryAction = this.getLink(menu.action.route, linkProps);
        }

        if (_.isArray(menu.route)) {
            caret = <span className="icon icon-caret-down"></span>;
            items = (
                <ul>
                    {menu.route.map((i, key) => {
                        if (!this.canAccess(i)) {
                            return null;
                        }
                        return (
                            <li key={key}>
                                <Link route={i.route}>{i.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        const active = '';

        return (
            <li key={index} className={active}>
                {mainAction}
                {secondaryAction}
                {caret}
                {items}
            </li>
        );
    }
}

Navigation.defaultProps = {
    renderer() {
        const Layout = Webiny.Apps.Core.Backend.Layout.Components;

        const menu = [];
        _.each(Webiny.Menu.getMenu(), m => {
            if (this.canAccess(m)) {
                menu.push(this.renderMainMenu(m));
            }
        });

        const submenu = [];
        _.each(Webiny.Menu.getMenu(), m => {
            submenu.push(this.renderSubMenu(m));
        });

        // In case the submenu is empty - remove the main menu item
        _.each(submenu, (s, index) => {
            if (!s) {
                menu[index] = null;
            }
        });

        return (
            <div className="master-navigation">
                <Layout.Header/>

                <div className="navbar-collapse collapse" id="left-sidebar">
                    <div className="shield"></div>
                    <div className="left-menu">
                        <ul className="nav navbar-nav navbar-right">
                            {menu}
                        </ul>
                    </div>

                    <div className="left-menu-submenu" style={{display: this.state.submenu ? 'block' : 'none'}}>
                        <div>
                            {submenu}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Navigation;
