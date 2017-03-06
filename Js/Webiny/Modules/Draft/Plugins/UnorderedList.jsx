import Webiny from 'Webiny';
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';
const Ui = Webiny.Ui.Components;

class UnorderedListPlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'unordered-list';
        this.block = 'unordered-list-item';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-list-ul" plugin={this} tooltip="Toggle unordered list"/>
        };
    }
}

export default UnorderedListPlugin;