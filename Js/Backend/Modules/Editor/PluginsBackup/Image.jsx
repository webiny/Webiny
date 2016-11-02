import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const {Entity, RichUtils} = Draft;
import DraftUtils from './../DraftUtils';

const ImageComponent = (props) => {
    return (
        <figure className="image-plugin-wrapper">
            <img src={props.blockProps.data.url}/>
            <figcaption>Dachshuuuund!</figcaption>
        </figure>
    );
};

const ReadOnlyImageComponent = (props) => {
    return (
        <div className="readonly-image-plugin-wrapper" style={{padding: 10}}>
            <img src={props.blockProps.data.url} alt="My dachshuuuund!" title="Woof!"/>
            <figcaption>Dachshuuuund!</figcaption>
            <Ui.Button type="secondary" onClick={() => alert('Woof woof!')} label="Bark!"/>
        </div>
    );
};

class ImageAction extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.bindMethods('getImage');
    }

    getImage() {
        const url = 'https://s-media-cache-ak0.pinimg.com/236x/87/61/f9/8761f91014d0fd1cc63d9ea5f684f96d.jpg';
        const {editorState} = this.props;
        this.props.onChange(DraftUtils.insertDataBlock(editorState, {url, plugin: 'image'}));
    }
}

ImageAction.defaultProps = {
    renderer(){
        return (
            <Ui.Button onClick={this.getImage} icon="fa-picture-o"/>
        );
    }
};


export default {
    name: 'image',
    toolbar: ImageAction,
    blockRenderer: (contentBlock) => {
        const type = contentBlock.getType();
        const dataType = contentBlock.getData().toObject().plugin;
        if (type === 'atomic' && dataType === 'image') {
            return {
                component: ImageComponent,
                editable: false
            };
        }
    },
    readOnlyBlockRenderer: (contentBlock) => {
        const type = contentBlock.getType();
        const dataType = contentBlock.getData().toObject().plugin;
        if (type === 'atomic' && dataType === 'image') {
            return {
                component: ReadOnlyImageComponent,
                editable: false
            };
        }
    },
    toHtml: (block) => {
        if (block.type === 'atomic' && block.data.plugin === 'image') {
            return (
                <figure className="html-image">
                    <img src={block.data.url}/>
                    <figcaption>Caption</figcaption>
                </figure>
            );
        }
    }
};