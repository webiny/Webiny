import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * Traverse all menus and try to match a menu which points to the given route.
 * Return top level menu.
 */
function findMenuByRoute(menus, route) {
    let found = null;
    _.each(menus, menu => {
        const children = React.Children.toArray(menu.props.children);
        if (children.length) {
            if (findMenuByRoute(children, route)) {
                found = menu;
                return false;
            }
        } else if (menu.props.route === route.name) {
            found = menu;
            return false;
        }
    });
    return found;
}

/**
 * Find menu by route and return menu id or default value.
 */
function checkRoute(route, defaultValue = null) {
    // Check if current route has an associated menu item
    const routeMenu = findMenuByRoute(Webiny.Menu.getMenu(), route);
    if (routeMenu) {
        return routeMenu.props.id || routeMenu.props.label;
    }
    return defaultValue;
}

/**
 * Note: this class needs to be optimized. The handling of mobile menu is just awful, a lot of (ughh) jquery code which needs to go out.
 * For now it does the job, but once we have more time we'll clean it up.
 */
class Navigation extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            display: window.outerWidth > 768 ? 'desktop' : 'mobile'
        };

        this.bindMethods('onMainMenuClick');

        this.checkDisplayInterval = null;
        this.offRouteChanged = _.noop;
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({active: checkRoute(Webiny.Router.getActiveRoute())});

        this.offRouteChanged = Webiny.Router.onRouteChanged(event => {
            this.setState({route: event.route.name, active: checkRoute(event.route, this.state.active)});
        });

        this.checkDisplayInterval = setInterval(() => {
            this.setState({display: window.outerWidth > 768 ? 'desktop' : 'mobile'});
        }, 500);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    onMainMenuClick(menuId) {
        this.setState({open: menuId});
    }
}

Navigation.defaultProps = {
    renderer() {
        return (
            <div className="navigation">
                <div className="shield"/>
                <div className="main-menu">
                    <ul className="menu-list level-0">
                        {Webiny.Menu.getMenu().map(menu => (
                            React.cloneElement(menu, {
                                active: this.state.active,
                                display: this.state.display,
                                onClick: this.onMainMenuClick,
                                key: menu.props.id || menu.props.label,
                                open: this.state.open
                            })
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Navigation, {modules: ['Link']});
