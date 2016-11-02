import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

class BlockquotePlugin extends BlockTypePlugin {
    constructor() {
        super();
        this.name = 'blockquote';
        this.block = 'blockquote';
    }

    getEditConfig() {
        return _.merge(super.getEditConfig(), {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-quote-right" plugin={this}/>
        });
    }
}

export default BlockquotePlugin;