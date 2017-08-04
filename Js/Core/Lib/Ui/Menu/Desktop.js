import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import Component from './../../Core/Component';
import createComponent from './../../createComponent';

class Desktop extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.bindMethods('onClick');
    }

    onClick() {
        if (this.props.level === 0) {
            this.props.onClick(this.props.id || this.props.label);
        }
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
}

Desktop.defaultProps = {
    id: null,
    label: null,
    icon: null,
    order: 100,
    role: null,
    route: null,
    level: 0,
    overwriteExisting: false,
    renderer() {
        const menu = _.omit(this.props, ['renderer']);
        menu.id = menu.id || menu.label;
        const children = React.Children.toArray(this.props.children);
        const hasChildren = children.length > 0;

        const menuIconClass = this.classSet('icon app-icon', {'fa': _.includes(menu.icon, 'fa-')}, menu.icon);

        const linkProps = {
            key: menu.id,
            label: menu.label,
            children: [
                menu.icon ? <span key="icon" className={menuIconClass}/> : null,
                menu.level > 1 ? menu.label : <span key="title" className="app-title">{menu.label}</span>,
                hasChildren && menu.level > 0 ? <span key="caret" className="icon-caret-down icon mobile-caret"/> : null
            ]
        };

        const className = this.classSet({
            open: this.props.open === menu.id,
            active: this.props.active === menu.id
        });

        return (
            <li className={className} key={menu.id} onClick={this.onClick}>
                {this.getLink(menu.route, linkProps)}
                {hasChildren && (
                    <ul className={'level-' + (this.props.level + 1)}>
                        {children.map((child, i) => {
                            return React.cloneElement(child, {key: i, onClick: this.props.onClick});
                        })}
                    </ul>
                )}
            </li>
        );
    }
};

export default createComponent(Desktop, {modules: ['Link']});