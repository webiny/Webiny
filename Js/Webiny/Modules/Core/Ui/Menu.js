import Webiny from 'Webiny';

class Menu {

    constructor(label, route = null, icon = '', key = '') {
        Object.assign(this, {label, route, icon});
        this.key = key ? key : label;
        this.action = null;
    }

    setAction(label, route, icon = '') {
        this.action = {label, route, icon};
        return this;
    }

    clone() {
        let route = this.route;
        if (_.isArray(route)) {
            route = route.map(r => r.clone());
        }
        const menu = new Menu(this.label, route, this.icon, this.key);
        if (this.action) {
            menu.setAction(...this.action);
        }
        return menu;
    }
}

export default Menu;