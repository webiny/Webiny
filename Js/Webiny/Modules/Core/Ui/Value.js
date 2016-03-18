import Webiny from 'Webiny';
import Component from './../Core/Component';

class Value extends Component {

    render() {
        let value = null;
        if (_.isFunction(this.props.value)) {
            value = this.props.value();
        } else {
            value = Webiny.Ui.Dispatcher.value(this.props.value)();
        }

        if (value) {
            return <webiny-value>{value}</webiny-value>;
        }
        return null;
    }
}

export default Value;