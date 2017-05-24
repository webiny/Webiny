import Webiny from 'Webiny';

class Empty extends Webiny.Ui.Component {

}

Empty.defaultProps = {
    renderer() {
        return <webiny-dynamic-fieldset-empty>{this.props.children}</webiny-dynamic-fieldset-empty>;
    }
};

export default Empty;