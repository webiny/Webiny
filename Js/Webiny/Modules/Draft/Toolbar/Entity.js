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
        return (
            <Ui.Button disabled={disabled} type={isActive ? 'primary' : 'default'} onClick={click.bind(this.props.plugin)} icon={this.props.icon}>
                {this.props.children}
            </Ui.Button>
        );
    }
};

export default Entity;