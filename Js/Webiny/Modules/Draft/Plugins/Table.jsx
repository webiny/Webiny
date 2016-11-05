import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import Editor from './../Editor';
import Utils from './../Utils';
import TableEditComponent from './Table/TableEditComponent';

class TablePlugin extends AtomicPlugin {
    constructor(config) {
        super(config);
        this.name = 'table';
    }

    createBlock() {
        const insert = {
            type: 'atomic',
            text: ' ',
            data: {
                plugin: this.name
            },
            entity: {
                type: this.name,
                mutability: 'IMMUTABLE',
                data: {
                    headers: [],
                    rows: [[],[]],
                    numberOfColumns: 2
                }
            }
        };
        const editorState = Utils.insertDataBlock(this.editor.getEditorState(), insert);
        this.editor.setEditorState(editorState);
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.Atomic icon="fa-table" plugin={this} tooltip="Insert a table"/>,
            blockRendererFn: (contentBlock) => {
                const plugin = contentBlock.getData().get('plugin');
                if (contentBlock.getType() === 'atomic' && plugin === this.name) {
                    return {
                        component: TableEditComponent,
                        editable: false
                    };
                }
            }
        };
    }
}

export default TablePlugin;