import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

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