import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

class AlignCenterPlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'align-center';
        this.block = 'align-center';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.BlockType icon="fa-align-center" plugin={this} tooltip="Align block to the center"/>,
            blockRenderMap: {
                'align-center': {
                    element: null,
                    wrapper: <span className="text-center"/>
                }
            }
        };
    }
}

export default AlignCenterPlugin;