class Menu {

    constructor(label, route = null, icon = '', key = '') {
        Object.assign(this, {label, route, icon});
        this.key = key ? key : label;
        this.action = null;
        this.role = null;
        this.overrideExisting = false;
    }

    setAction(label, route, icon = '') {
        this.action = {label, route, icon};
        return this;
    }

    setOverrideExisting() {
        this.overrideExisting = true;
        return this;
    }

    setRole(role) {
        this.role = role;
        return this;
    }
}

export default Menu;