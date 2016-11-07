import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class PluginBlock extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.bindMethods('onMouseDown', 'updateBlockData', 'updateEntityData');
    }

    onMouseDown(e) {
        const editor = this.props.blockProps.editor;
        editor.setReadOnly(true);
        e.stopPropagation();
    }

    onClick(e) {
        e.stopPropagation();
    }

    updateBlockData(data) {
        this.props.blockProps.editor.updateBlockData(this.props.block, data);
    }

    updateEntityData(data, key = null) {
        if (!key) {
            key = this.props.block.getEntityAt(0);
        }

        Draft.Entity.mergeData(key, data);
        this.updateBlockData(data);
    }
}

PluginBlock.defaultProps = {
    renderer() {
        const Plugin = this.props.blockProps.plugin.component;
        const editor = this.props.blockProps.editor;
        const data = this.props.block.getData().toJS();

        const block = this.props.block;
        const eventHandlers = {
            onMouseDown: this.onMouseDown,
            onBlur: this.onBlur,
            onClick: this.onClick
        };

        const props = {
            block,
            entity: null,
            data,
            editor,
            updateBlockData: this.updateBlockData,
            updateEntityData: this.updateEntityData,
            container: this
        };

        const entityKey = block.getEntityAt(0);
        if (entityKey) {
            const entityData = Draft.Entity.get(entityKey).get('data');
            props.entity = {
                key: entityKey,
                data: entityData
            };
        }

        return (
            <div className="plugin-block-wrapper" {...eventHandlers}>
                <Plugin {...props}/>
            </div>
        );
    }
};

export default PluginBlock;