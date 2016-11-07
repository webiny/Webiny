import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

class AlignRightPlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'align-right';
        this.block = 'align-right';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-align-right" plugin={this} tooltip="Align block to the right"/>,
            blockRenderMap: {
                'align-right': {
                    element: null,
                    wrapper: <span className="text-right"/>
                }
            }
        };
    }
}

export default AlignRightPlugin;