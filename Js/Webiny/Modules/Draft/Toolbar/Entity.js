import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Entity extends Webiny.Ui.Component {
}

Entity.defaultProps = {
    plugin: null,
    icon: null,
    renderer(){
        const isActive = this.props.plugin.isActive();
        const disabled = this.props.plugin.isDisabled();
        const click = isActive ? this.props.plugin.removeEntity : this.props.plugin.setEntity;
        const props = {
            disabled,
            type: isActive ? 'primary' : 'default',
            onClick: click.bind(this.props.plugin),
            icon: this.props.icon,
            tooltip: this.props.tooltip
        };

        return (
            <Ui.Button {...props}>{this.props.children}</Ui.Button>
        );
    }
};

export default Entity;