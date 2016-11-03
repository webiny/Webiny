import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class PluginBlock extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.bindMethods('onMouseDown', 'updateData');
    }

    onMouseDown(e) {
        const editor = this.props.blockProps.editor;
        editor.setReadOnly(true);
        e.stopPropagation();
    }

    onClick(e) {
        e.stopPropagation();
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
        const eventHandlers = {
            onMouseDown: this.onMouseDown,
            onBlur: this.onBlur,
            onClick: this.onClick
        };

        return (
            <div className="plugin-block-wrapper" {...eventHandlers}>
                <Plugin data={data} editor={editor} updateData={this.updateData} container={this} block={block}/>
            </div>
        );
    }
};

export default PluginBlock;