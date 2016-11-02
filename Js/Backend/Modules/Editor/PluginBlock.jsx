import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class PluginBlock extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.bindMethods('onMouseDown', 'onBlur', 'updateData');
    }

    onMouseDown() {
        console.log('Plugin block MOUSE DOWN');
        const editor = this.props.blockProps.editor;
        editor.setReadOnly(true);
    }

    onClick(e) {
        console.log('Plugin block clicked');
        e.stopPropagation();
    }

    onBlur() {
        console.log('Plugin block BLUR');
        const editor = this.props.blockProps.editor;
        editor.setReadOnly(false);
    }

    updateData(data) {
        this.props.blockProps.editor.updateBlockData(this.props.block, data);
    }
}

PluginBlock.defaultProps = {
    renderer() {
        const Plugin = this.props.blockProps.plugin.component;
        const editor = this.props.blockProps.editor;
        const data = this.props.block.getData().toJS();

        const block = this.props.block;
        const entityKey = block.getEntityAt(0);
        const entityData = Draft.Entity.get(entityKey).get('data');
        console.log(entityKey, Draft.Entity.get(entityKey));

        const eventHandlers = {
            onMouseDown: this.onMouseDown,
            onBlur: this.onBlur,
            onClick: this.onClick
        };

        return (
            <div className="plugin-block-wrapper" {...eventHandlers}>
                <hr/>
                <Plugin data={data} editor={editor} updateData={this.updateData} container={this} block={block} entityData={entityData}/>
            </div>
        );
    }
};

export default PluginBlock;