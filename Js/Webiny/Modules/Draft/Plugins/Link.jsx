import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const {Entity, RichUtils} = Draft;
import DraftUtils from './../DraftUtils';

class LinkAction extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.bindMethods('getLink,removeLink,isActive');
    }

    getLink() {
        const url = window.prompt('Enter URL');
        const editorState = this.props.editor.getEditorState();
        const entityKey = Entity.create('LINK', 'MUTABLE', {url, target: '_blank', className: 'website-highlight'});
        this.props.editor.setEditorState(RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey));
    }

    removeLink() {
        const editorState = this.props.editor.getEditorState();
        const entityKey = DraftUtils.getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection());
        const entitySelectionState = DraftUtils.getEntitySelectionState(editorState.getCurrentContent(), editorState.getSelection(), entityKey);
        this.props.editor.setEditorState(RichUtils.toggleLink(editorState, entitySelectionState, null));
    }

    isActive() {
        const editorState = this.props.editor.getEditorState();
        const entityKey = DraftUtils.getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection());
        return entityKey && Entity.get(entityKey).getType() === 'LINK';
    }
}

LinkAction.defaultProps = {
    renderer(){
        const isActive = this.isActive();
        const click = isActive ? this.removeLink : this.getLink;
        return (
            <Ui.Button type={isActive ? 'primary' : 'default'} onClick={click} icon="fa-link"/>
        );
    }
};

export default () => {
    return {
        name: 'link',
        toolbar: <LinkAction/>,
        decorators: [
            {
                strategy: 'LINK',
                component: (props) => {
                    const data = Entity.get(props.entityKey).getData();
                    return (
                        <a href={data.url} target={data.target}>{props.children}</a>
                    );
                }
            }
        ]
    };
}