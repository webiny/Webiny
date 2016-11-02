import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Atomic extends Webiny.Ui.Component {
}

Atomic.defaultProps = {
    plugin: null,
    icon: null,
    renderer(){
        const disabled = this.props.plugin.isDisabled();
        return (
            <Ui.Button disabled={disabled} type="default" onClick={() => this.props.plugin.createBlock()} icon={this.props.icon}>
                {this.props.children}
            </Ui.Button>
        );
    }
};

export default Atomic;