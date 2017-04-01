import Webiny from 'Webiny';

class Button extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled: true
        };
    }

    disable() {
        this.setState({enabled: false});
    }

    enable() {
        this.setState({enabled: true});
    }
}

Button.defaultProps = {
    size: 'normal',
    type: 'default',
    align: 'normal',
    icon: null,
    className: null,
    style: null,
    label: null,
    onClick: _.noop,
    tooltip: null,
    renderer() {
        return <div>Bu!</div>
    }
};

export default Button;
