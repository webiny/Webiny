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
        const onClick = () => this.props.plugin.toggleBlockType();
        return (
            <Ui.Button disabled={disabled} type={isActive ? 'primary' : 'default'} onClick={onClick} icon={this.props.icon}/>
        );
    }
};

export default BlockType;