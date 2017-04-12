import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

class OrderedListPlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'ordered-list';
        this.block = 'ordered-list-item';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-list-ol" plugin={this} tooltip="Toggle ordered list"/>
        };
    }
}

export default OrderedListPlugin;