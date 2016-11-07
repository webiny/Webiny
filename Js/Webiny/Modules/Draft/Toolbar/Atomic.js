import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Atomic extends Webiny.Ui.Component {
}

Atomic.defaultProps = {
    plugin: null,
    icon: null,
    renderer(){
        const disabled = this.props.plugin.isDisabled();
        const props = {
            style: this.props.style || {},
            className: this.props.className || '',
            disabled,
            type: 'default',
            onClick: () => this.props.plugin.createBlock(),
            icon: this.props.icon,
            tooltip: this.props.tooltip
        };

        return (
            <Ui.Button {...props}>{this.props.children}</Ui.Button>
        );
    }
};

export default Atomic;