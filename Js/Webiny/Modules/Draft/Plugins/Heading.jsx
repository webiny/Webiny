import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './../BasePlugins/BlockTypePlugin';

const map = {
    'unstyled': 'Normal',
    'header-one': 'Heading 1',
    'header-two': 'Heading 2',
    'header-three': 'Heading 3',
    'header-four': 'Heading 4',
    'header-five': 'Heading 5',
    'header-six': 'Heading 6'
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
                const type = this.getStartBlockType('unstyled');

                return (
                    <Ui.Dropdown title={_.get(map, type, 'Normal')} disabled={this.editor.getReadOnly()}>
                        {_.keys(map).map(k => (
                            <Ui.Dropdown.Link key={k} onClick={() => this.setHeading(k)} title={map[k]}/>
                        ))}
                    </Ui.Dropdown>
                );
            }
        };
    }
}

export default HeadingPlugin;