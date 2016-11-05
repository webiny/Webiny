import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

const map = {
    'untyped': 'Normal',
    'header-one': 'Heading 1',
    'header-two': 'Heading 2',
    'header-three': 'Heading 3'
};

class HeadingPlugin extends BlockTypePlugin {
    constructor(config) {
        super(config);
        this.name = 'heading';
    }

    setHeading(heading) {
        const editorState = this.editor.getEditorState();
        this.editor.setEditorState(Draft.RichUtils.toggleBlockType(editorState, heading));
    }

    getEditConfig() {
        return {
            toolbar: () => {
                let type = this.getStartBlockType('unstyled');

                return (
                    <Ui.Dropdown title={_.get(map, type, 'Normal')} disabled={this.editor.getReadOnly()}>
                        <Ui.Dropdown.Link onClick={() => this.setHeading("unstyled")} title="Normal"/>
                        <Ui.Dropdown.Link onClick={() => this.setHeading("header-one")} title="Header 1"/>
                        <Ui.Dropdown.Link onClick={() => this.setHeading("header-two")} title="Header 2"/>
                        <Ui.Dropdown.Link onClick={() => this.setHeading("header-three")} title="Header 3"/>
                    </Ui.Dropdown>
                );
            }
        };
    }
}

export default HeadingPlugin;