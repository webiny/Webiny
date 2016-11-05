import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

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