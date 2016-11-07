import Webiny from 'Webiny';
import BasePlugin from './../../BasePlugins/BasePlugin';

class TabHandler extends BasePlugin {
    constructor(config) {
        super(config);
    }

    getEditConfig() {
        return {
            onTab: () => {
                return this.config.selectNextEditor();
            }
        };
    }
}

export default TabHandler;