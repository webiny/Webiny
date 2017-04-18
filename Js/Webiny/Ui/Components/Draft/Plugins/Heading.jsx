import Webiny from 'Webiny';
import Draft from 'draft-js';

const map = {
    'unstyled': 'Normal',
    'header-one': 'Heading 1',
    'header-two': 'Heading 2',
    'header-three': 'Heading 3',
    'header-four': 'Heading 4',
    'header-five': 'Heading 5',
    'header-six': 'Heading 6'
};

class HeadingPlugin extends Webiny.Draft.BlockTypePlugin {
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
                    <Webiny.Ui.LazyLoad modules={['Dropdown']}>
                        {({Dropdown}) => (
                            <Dropdown title={_.get(map, type, 'Normal')} disabled={this.editor.getReadOnly()}>
                                {_.keys(map).map(k => (
                                    <Dropdown.Link key={k} onClick={() => this.setHeading(k)} title={map[k]}/>
                                ))}
                            </Dropdown>
                        )}
                    </Webiny.Ui.LazyLoad>
                );
            }
        };
    }
}

export default HeadingPlugin;