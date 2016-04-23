import Webiny from 'Webiny';

class Menu {

    constructor(label, route = null, icon = '', key = '') {
        Object.assign(this, {label, route, icon});
        this.key = key ? key : Webiny.Tools.toSlug(label);
        this.action = null;
    }

    setAction(label, route, icon = '') {
        this.action = {label, route, icon};
        return this;
    }
}

export default Menu;