import Webiny from 'Webiny';
import TooltipWrapper from './TooltipWrapper';

class Tooltip extends Webiny.Ui.Component {
}

Tooltip.defaultProps = {
    placement: 'right',
    trigger: 'hover',
    interactive: false,
    target: null,
    delay: [5, 5],
    renderer() {
        return (
            <TooltipWrapper
                placement={this.props.placement}
                trigger={this.props.trigger}
                interactive={this.props.interactive}
                target={this.props.target}
                delay={this.props.delay}
                content={this.props.children}/>
        );
    }
};

export default Webiny.createComponent(Tooltip);