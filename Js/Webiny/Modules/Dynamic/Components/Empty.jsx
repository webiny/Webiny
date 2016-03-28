import Webiny from 'Webiny';

class Empty extends Webiny.Ui.Component {

    render() {
        return <webiny-dynamic-fieldset-empty>{this.props.children}</webiny-dynamic-fieldset-empty>;
    }
}

export default Empty;