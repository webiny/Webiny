import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import Utils from './../Utils';

class ImageEditComponent extends Webiny.Ui.Component {

}

ImageEditComponent.defaultProps = {
    renderer() {
        const captionChange = caption => this.props.updateBlockData({caption});
        return (
            <div className="image-plugin-wrapper">
                <Ui.Grid.Col xs={12}>
                    <img src={this.props.data.url}/>
                    <Ui.Input value={this.props.data.caption} onChange={captionChange} placeholder="Enter a caption for this image"/>
                </Ui.Grid.Col>
            </div>
        );
    }
};

class ImageComponent extends Webiny.Ui.Component {

}

ImageComponent.defaultProps = {
    renderer() {
        const captionChange = caption => this.props.updateBlockData({caption});
        return (
            <div className="image-plugin-wrapper">
                <img src={this.props.data.url}/>
                <Ui.Input value={this.props.data.caption} onChange={captionChange} placeholder="Enter a caption for this image"/>
            </div>
        );
    }
};

class ImagePlugin extends AtomicPlugin {
    constructor(config) {
        super(config);
        this.validate = _.get(config, 'validate', 'required');
        this.name = 'image';
        this.id = _.uniqueId('insertImage-');
        this.api = null;
        if (config.api) {
            this.api = new Webiny.Api.Endpoint(config.api);
        }
    }

    submitModal(model) {
        if (model.image) {
            this.api.post('/', model.image).then(apiResponse => {
                delete model.image;
                const file = apiResponse.getData();
                model.url = file.src;
                model.id = file.id;
                model.fromFile = true;
                this.createImageBlock(model);
            });
        } else {
            this.createImageBlock(model);
        }
    }

    createBlock() {
        this.editor.setReadOnly(true);
        this.ui(this.id).show();
    }

    createImageBlock(model) {
        model.plugin = this.name;
        const insert = {
            type: 'atomic',
            text: ' ',
            data: model
        };
        this.ui(this.id).hide().then(() => {
            const editorState = Utils.insertDataBlock(this.editor.getEditorState(), insert);
            this.editor.setEditorState(editorState);
        });
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.Atomic icon="fa-image" plugin={this} tooltip="Insert an image"/>,
            customView: (
                <Ui.Modal.Dialog ui={this.id}>
                    <Ui.Form onSubmit={this.submitModal.bind(this)}>
                        {(model, form) => {
                            const urlValidator = model.image ? null : 'required,url';
                            return (
                                <wrapper>
                                    <Ui.Modal.Header title="Insert image"/>
                                    <Ui.Modal.Body noPadding>
                                        <Ui.Tabs>
                                            <Ui.Tabs.Tab label="URL" icon="fa-link">
                                                <Ui.Input name="url" placeholder="Enter an image URL" label="URL" validate={urlValidator}/>
                                            </Ui.Tabs.Tab>
                                            <Ui.Tabs.Tab label="Upload" icon="fa-upload">
                                                <Ui.Files.Image
                                                    name="image"
                                                    cropper={{
                                                    inline: true,
                                                    title: 'Crop your image',
                                                    action: 'Upload image',
                                                    config: {
                                                        closeOnClick: false,
                                                        autoCropArea: 0.7,
                                                        guides: false,
                                                        strict: true,
                                                        mouseWheelZoom: true
                                                    }}}/>
                                            </Ui.Tabs.Tab>
                                        </Ui.Tabs>
                                    </Ui.Modal.Body>
                                    <Ui.Modal.Footer align="right">
                                        <Ui.Button type="default" key="cancel" label="Cancel" onClick={this.ui(this.id + ':hide')}/>
                                        <Ui.Button type="primary" key="submit" label="Insert" onClick={form.submit}/>
                                    </Ui.Modal.Footer>
                                </wrapper>
                            );
                        }}
                    </Ui.Form>
                </Ui.Modal.Dialog>
            ),
            blockRendererFn: (contentBlock) => {
                const plugin = contentBlock.getData().get('plugin');
                if (contentBlock.getType() === 'atomic' && plugin === this.name) {
                    return {
                        component: ImageEditComponent,
                        editable: false
                    };
                }
            }
        };
    }
}

export default ImagePlugin;