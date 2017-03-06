import Webiny from 'Webiny';
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';
const Ui = Webiny.Ui.Components;

class BlockquotePlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'blockquote';
        this.block = 'blockquote';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-quote-right" plugin={this} tooltip="Make a quote"/>
        };
    }
}

export default BlockquotePlugin;