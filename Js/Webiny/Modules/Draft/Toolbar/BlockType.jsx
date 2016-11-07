import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class BlockType extends Webiny.Ui.Component {
}

BlockType.defaultProps = {
    icon: null,
    plugin: null,
    renderer(){
        const isActive = this.props.plugin.isActive();
        const disabled = this.props.plugin.isDisabled();
        const props = {
            disabled,
            type: isActive ? 'primary' : 'default',
            onClick: () => this.props.plugin.toggleBlockType(),
            icon: this.props.icon,
            tooltip: this.props.tooltip
        };
        return (
            <Ui.Button {...props}/>
        );
    }
};

export default BlockType;