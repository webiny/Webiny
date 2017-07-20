import _ from 'lodash';

class Menu {

    constructor(label, route = null, icon = '', key = '') {
        Object.assign(this, {label, route, icon});
        this.key = key ? key : label;
        this.action = null;
        this.role = null;
        this.order = 100;
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
        if (_.isString(role)) {
            role = role.split(',');
        }
        this.role = role;
        return this;
    }

    setOrder(order) {
        if (!_.isNumber(order) || (_.isNumber(order) && order < 0)) {
            throw new Error('Menu order must be a number greater than 0');
        }
        this.order = order;
        return this;
    }
}

export default Menu;