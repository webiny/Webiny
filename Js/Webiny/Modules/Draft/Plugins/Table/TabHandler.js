import BasePlugin from './../../BasePlugins/BasePlugin';

class TabHandler extends BasePlugin {
    constructor(config) {
        super(config);
    }

    getEditConfig() {
        return {
            onTab: () => {
                if (!this.editor.getReadOnly()) {
                    return this.config.selectNextEditor();
                }
            }
        };
    }
}

export default TabHandler;