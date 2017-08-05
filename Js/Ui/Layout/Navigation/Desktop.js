import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';
import utils from './utils';

class Desktop extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.bindMethods('onClick');
    }

    componentDidMount() {
        super.componentDidMount();
        this.setState({active: utils.checkRoute(Webiny.Router.getActiveRoute())});
    }

    onClick(menu) {
        if (menu.props.level === 0) {
            this.setState({open: menu.props.id || menu.props.label});
        }
    }

    /**
     * Menu renderer passed to <Menu>.
     * Note that `this` is bound to <Menu>.
     */
    renderMenu() {
        const props = _.clone(this.props);
        props.id = props.id || props.label;
        const children = React.Children.toArray(props.children);
        const hasChildren = children.length > 0;

        const menuIconClass = this.classSet('icon app-icon', {'fa': _.includes(props.icon, 'fa-')}, props.icon);

        const linkProps = {
            key: props.id,
            label: props.label,
            children: [
                props.icon ? <span key="icon" className={menuIconClass}/> : null,
                props.level > 1 ? props.label : <span key="title" className="app-title">{props.label}</span>,
                hasChildren && props.level > 0 ? <span key="caret" className="icon icon-caret-down"/> : null
            ]
        };

        const className = this.classSet({
            open: props.open === props.id,
            active: props.level === 0 ? utils.findRoute(props, Webiny.Router.getActiveRoute().getName()) : false
        });

        return (
            <li className={className} key={props.id} onClick={() => props.onClick(this)}>
                {utils.getLink(props.route, props.Link, linkProps)}
                {hasChildren && (
                    <ul className={'level-' + (this.props.level + 1)}>
                        {children.map((child, i) => {
                            return React.cloneElement(child, {
                                key: i,
                                onClick: () => props.onClick(this),
                                renderer: props.renderer,
                                Link: props.Link
                            });
                        })}
                    </ul>
                )}
            </li>
        );
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
        return (
            <div className="navigation">
                <div className="shield"/>
                <div className="main-menu">
                    <ul className="menu-list level-0">
                        {Webiny.Menu.getMenu().map(menu => (
                            React.cloneElement(menu, {
                                active: this.state.active,
                                onClick: this.onClick,
                                key: menu.props.id || menu.props.label,
                                open: this.state.open,
                                renderer: this.renderMenu,
                                Link: this.props.Link
                            })
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Desktop, {modules: ['Link']});