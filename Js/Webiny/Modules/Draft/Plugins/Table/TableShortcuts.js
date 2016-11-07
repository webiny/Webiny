import Webiny from 'Webiny';
import BasePlugin from './../../BasePlugins/BasePlugin';

class TableShortcuts extends BasePlugin {
    constructor(config) {
        super(config);
        this.name = 'insert-table-row';
    }

    getEditConfig() {
        return {
            handleKeyCommand: (command) => {
                if (command === 'insert-table-row') {
                    this.config.insertRow();
                    return true;
                }

                if (command === 'delete-table-row') {
                    this.config.deleteRow();
                    return true;
                }
            },

            keyBindingFn: (e) => {
                if (Draft.KeyBindingUtil.hasCommandModifier(e)) {
                    switch (e.keyCode) {
                        case 68:
                            return 'insert-table-row';
                        case 88:
                            return 'delete-table-row';
                        default:
                            return false;
                    }
                }
            }
        };
    }
}

export default TableShortcuts;