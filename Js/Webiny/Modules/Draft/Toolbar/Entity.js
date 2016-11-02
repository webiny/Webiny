import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EntityPlugin extends Webiny.Draft.BasePlugin{

}

class EntityPlugin extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.bindMethods('createEntity,setEntity,removeEntity,isActive');
    }

    createEntity(){
        throw Error('Implement "createEntity" method in your plugin!');
    }

    setEntity() {
        const editorState = this.props.editor.getEditorState();
        const selection = editorState.getSelection();
        if(selection.isCollapsed()){
            return;
        }

        // Create a new entity
        const entityKey = this.createEntity();
        let newContentState = Draft.Modifier.applyEntity(editorState.getCurrentContent(), selection, entityKey);
        const newEditorState = Draft.EditorState.createWithContent(newContentState, this.props.editor.getDecorators());
        this.props.editor.setEditorState(newEditorState);
    }

    removeEntity() {
        const editorState = this.props.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const entityKey = DraftUtils.getEntityKeyForSelection(contentState, selection);
        const entitySelectionState = DraftUtils.getEntitySelectionState(contentState, selection, entityKey);
        this.props.editor.setEditorState(Draft.RichUtils.toggleLink(editorState, entitySelectionState, null));
    }

    isActive() {
        const editorState = this.props.editor.getEditorState();
        const entityKey = DraftUtils.getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection());
        return entityKey && Draft.Entity.get(entityKey).getType() === this.props.entity;
    }
}

EntityPlugin.defaultProps = {
    entity: null,
    icon: null,
    renderer(){
        const isActive = this.isActive();
        const click = isActive ? this.removeEntity : this.setEntity;
        return (
            <Ui.Button type={isActive ? 'primary' : 'default'} onClick={click} icon={this.props.icon}/>
        );
    }
};

export default EntityPlugin;