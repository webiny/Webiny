import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import DraftUtils from './../DraftUtils';

class ImageComponent extends Webiny.Ui.Component {

}

ImageComponent.defaultProps = {
    renderer() {
        const captionChange = caption => this.props.updateData({caption});
        return (
            <div className="image-plugin-wrapper">
                <img src={this.props.data.url}/>
                <Ui.Input value={this.props.data.caption} onChange={captionChange} placeholder="Enter a caption for this image"/>
                <pre>
                    <code>

                    </code>
                </pre>
            </div>
        );
    }
};

class ImageAction extends Webiny.Ui.Component {
    getImage() {
        const url = 'https://s-media-cache-ak0.pinimg.com/236x/87/61/f9/8761f91014d0fd1cc63d9ea5f684f96d.jpg';
        const editorState = this.props.editor.getEditorState();
        this.props.editor.setEditorState(DraftUtils.insertDataBlock(editorState, {url, plugin: 'image'}));
    }
}

ImageAction.defaultProps = {
    renderer() {
        return (
            <Ui.Button disabled={this.props.editor.getReadOnly()} onClick={this.getImage.bind(this)} icon="fa-picture-o"/>
        );
    }
};

export default () => {
    const id = _.uniqueId('image-plugin-');
    return {
        name: 'image',
        toolbar: <ImageAction ui={id}/>,
        blockRendererFn: (contentBlock) => {
            const type = contentBlock.getType();
            const dataType = contentBlock.getData().toObject().plugin;
            if (type === 'atomic' && dataType === 'image') {
                return {
                    component: ImageComponent
                };
            }
        },
        handleKeyCommand: (command) => {
            if (command === 'insert-image') {
                Webiny.Ui.Dispatcher.get(id).getImage();
                return true;
            }
        },

        keyBindingFn: (e) => {
            // Alt+Shift+I
            if (e.keyCode === 73 && Draft.KeyBindingUtil.isOptionKeyCommand(e)) {
                return 'insert-image';
            }
        }
    };
};