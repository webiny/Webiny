import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

class AlignLeftPlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'align-left';
        this.block = 'align-left';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-align-left" plugin={this} tooltip="Align block to the left"/>,
            blockRenderMap: {
                'align-left': {
                    element: null,
                    wrapper: <span className="text-left"/>
                }
            }
        };
    }
}

export default AlignLeftPlugin;