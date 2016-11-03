import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class InlineStyle extends Webiny.Ui.Component {
}

InlineStyle.defaultProps = {
    icon: null,
    plugin: null,
    renderer(){
        const isActive = this.props.plugin.isActive();
        const disabled = this.props.plugin.isDisabled();
        const onClick = () => this.props.plugin.toggleStyle();
        return (
            <Ui.Button disabled={disabled} type={isActive ? 'primary' : 'default'} onClick={onClick} icon={this.props.icon}/>
        );
    }
};

export default InlineStyle;