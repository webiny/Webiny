import Webiny from 'Webiny';
import {editorStateToJSON} from './utils';
const Ui = Webiny.Ui.Components;
const {Editor, EditorState, RichUtils, CompositeDecorator, ContentState, Entity, AtomicBlockUtils, Modifier} = Draft;

const Link = (props) => {
    const data = Entity.get(props.entityKey).getData();
    return (
        <a href={data.url} target={data.target}>{props.children}</a>
    );
};

function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                Entity.get(entityKey).getType() === "link"
            );
        },
        callback
    );
}

const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link
    }
]);


class DraftEditor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        const initialHTML = '<h1><strong>Title</strong></h1><blockquote><strong>Some text</strong></blockquote><ul><li>adfasdf<ul><li>zsdfassd</li></ul></li></ul>';
        const contentState = DraftJsConverters.fromHtml(initialHTML);
        this.state = {editorState: EditorState.createWithContent(contentState, decorator)};
        this.bindMethods('focus', 'onChange', 'handleKeyCommand', 'onTab', 'toggleToolbarAction');

        this.actions = [
            {label: 'H1', style: 'header-one', type: 'block'},
            {label: 'H2', style: 'header-two', type: 'block'},
            {label: 'H3', style: 'header-three', type: 'block'},
            {label: 'H4', style: 'header-four', type: 'block'},
            {label: 'H5', style: 'header-five', type: 'block'},
            {label: 'H6', style: 'header-six', type: 'block'},
            {label: 'Blockquote', style: 'blockquote', type: 'block'},
            {label: 'UL', style: 'unordered-list-item', type: 'block'},
            {label: 'OL', style: 'ordered-list-item', type: 'block'},
            {label: 'Code Block', style: 'code-block', type: 'block'},
            {label: 'Bold', style: 'BOLD', type: 'style'},
            {label: 'Italic', style: 'ITALIC', type: 'style'},
            {label: 'Underline', style: 'UNDERLINE', type: 'style'},
            {label: 'Insert URL', style: 'link', type: () => {
                const {editorState} = this.state;
                const entityKey = Entity.create("link", "MUTABLE", {url: 'http://www.webiny.com', target: '_blank'});
                this.onChange(RichUtils.toggleLink(
                    editorState,
                    editorState.getSelection(),
                    entityKey
                ));
            }},
            {label: 'Add Data', style: '', type: () => {
                const {editorState} = this.state;
                const newContentState = Modifier.mergeBlockData(editorState.getCurrentContent(), editorState.getSelection(), {noviKey: '123', autoClose: true});
                this.onChange(EditorState.createWithContent(newContentState, decorator));
            }},
            {label: 'GET HTML', style: '', type: () => {
                console.log(DraftJsConverters.toHtml(this.state.editorState.getCurrentContent()))
            }},
            {label: 'GET JSON', style: '', type: () => {
                console.log(editorStateToJSON(this.state.editorState));
            }}
        ];
    }

    focus() {
        if(this.refs.editor){
            this.refs.editor.focus();
        }
    }

    onChange(editorState) {
        this.setState({editorState});
    }

    handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        //return false;
    }

    onTab(e) {
        e.stopPropagation();
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    toggleToolbarAction(object, type) {
        if(_.isFunction(type)){
            return type.call(this);
        }
        if (type === 'block') {
            return this.onChange(RichUtils.toggleBlockType(this.state.editorState, object));
        }

        return this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, object));
    }
}

DraftEditor.defaultProps = {
    renderer() {
        const {editorState} = this.state;

        const blockRenderMap = Immutable.Map({
            'code-block': {
                element: 'code',
                wrapper: <pre/>
            }
        });

        const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

        return (
            <Ui.Grid.Row style={{marginTop: 20}}>
                <Ui.Grid.Col xs={10} xsOffset={1}>
                    <div className="RichEditor-root">
                        <Toolbar actions={this.actions} editorState={editorState} onToggle={this.toggleToolbarAction}/>

                        <div onClick={this.focus}>
                            <Editor
                                ref="editor"
                                blockRenderMap={extendedBlockRenderMap}
                                editorState={editorState}
                                handleKeyCommand={this.handleKeyCommand}
                                onChange={this.onChange}
                                onTab={this.onTab}
                                placeholder="Tell a story..."
                                spellCheck={true}/>
                        </div>
                    </div>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        );
    }
};


class StyleButton extends Webiny.Ui.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style, this.props.type);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>{this.props.label}</span>
        );
    }
}

const Toolbar = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    return (
        <div className="RichEditor-controls">
            {props.actions.map((type) => {
                let active = false;
                if (type.type === 'block') {
                    active = type.style === editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
                } else {
                    active = props.editorState.getCurrentInlineStyle().has(type.style);
                }

                return (
                    <StyleButton
                        key={type.label}
                        active={active}
                        label={type.label}
                        onToggle={props.onToggle}
                        type={type.type}
                        style={type.style}/>
                );
            })}
        </div>
    );
};

export default DraftEditor;

// Bold, Italic, Headings, quote (blockquote), unordered list, ordered list, link, image