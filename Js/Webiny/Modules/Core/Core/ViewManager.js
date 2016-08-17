import Dispatcher from './Dispatcher';

class ViewManager {

    constructor() {
        this.placeholders = {};
    }

    getContent(placeholder) {
        return _.get(this.placeholders, placeholder);
    }

    render(content) {
        _.each(content, (components, key) => {
            this.placeholders[key] = components;
        });

        return Dispatcher.dispatch('RenderView');
    }
}

export default new ViewManager;