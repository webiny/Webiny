import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import utils from './utils';

class Mobile extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.bindMethods('onClick');

        /**
         * Menu renderer passed to <Menu>.
         * Note that `this` is still bound to `Mobile` class since we are passing an arrow function.
         */
        this.renderer = (menu) => {
            const props = _.clone(menu.props);
            props.id = props.id || props.label;
            const {level} = props;
            const children = React.Children.toArray(props.children);
            const hasChildren = children.length > 0;

            const menuIconClass = this.classSet('icon app-icon', {'fa': _.includes(props.icon, 'fa-')}, props.icon);

            const linkProps = {
                key: props.id,
                label: props.label,
                children: [
                    props.icon ? <span key="icon" className={menuIconClass}/> : null,
                    level > 1 ? props.label : <span key="title" className="app-title">{props.label}</span>,
                    hasChildren ? <span key="caret" className="icon icon-caret-down mobile-caret"/> : null
                ]
            };

            if (hasChildren) {
                linkProps.onClick = e => this.onClick(props.id, e);
            } else {
                linkProps.onClick = this.closeMobileMenu;
            }

            const className = this.classSet({
                open: this.state[props.id],
                active: props.level === 0 ? utils.findRoute(props, Webiny.Router.getActiveRoute().getName()) : false
            });

            return (
                <li className={className} key={props.id}>
                    {utils.getLink(props.route, this.props.Link, linkProps)}
                    {hasChildren && (
                        <ul className={'level-' + (level + 1)}>
                            <li className="main-menu--close back" onClick={e => this.onClick(props.id, e)}>Go Back</li>
                            {children.map((child, i) => {
                                return React.cloneElement(child, {
                                    key: i,
                                    renderer: props.renderer
                                });
                            })}
                        </ul>
                    )}
                </li>
            );
        };
    }

    onClick(id, e) {
        e.stopPropagation();
        const state = this.state;
        state[id] = !_.get(state, id, false);
        this.setState(state);
    }

    closeMobileMenu() {
        $('body').removeClass('mobile-nav');
    }
}

Mobile.defaultProps = {
    id: null,
    label: null,
    icon: null,
    order: 100,
    role: null,
    route: null,
    level: 0,
    overwriteExisting: false,
    renderer() {
        return (
            <div className="navigation">
                <div className="shield"/>
                <div className="main-menu">
                    <ul className="menu-list level-0">
                        <li className="main-menu--close" onClick={this.closeMobileMenu}>Close</li>
                        {Webiny.Menu.getMenu().map(menu => (
                            React.cloneElement(menu, {
                                key: menu.props.id || menu.props.label,
                                renderer: this.renderer
                            })
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Mobile, {modules: ['Link']});