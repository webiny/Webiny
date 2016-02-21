import Webiny from 'Webiny';

class Menu {

    constructor(label, route = null, icon = '') {
        Object.assign(this, {label, route, icon});
        this.key = Webiny.Tools.toSlug(label);
        this.action = null;
    }

    setAction(label, route, icon = '') {
        this.action = {label, route, icon};
        return this;
    }
}

export default Menu;