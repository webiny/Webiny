import React from 'react';
import _ from 'lodash';
import Component from './../Core/Component';
import createComponent from './../createComponent';
import DesktopMenu from './Menu/Desktop';
import MobileMenu from './Menu/Mobile';

class Menu extends Component {
}

Menu.defaultProps = {
    id: null,
    label: null,
    icon: null,
    order: 100,
    role: null,
    route: null,
    level: 0,
    overwriteExisting: false,
    renderer() {
        const props = _.omit(this.props, ['renderer']);

        if (this.props.display === 'desktop') {
            return <DesktopMenu {...props}/>;
        }

        return <MobileMenu {...props}/>;
    }
};

export default createComponent(Menu, {modules: ['Link']});