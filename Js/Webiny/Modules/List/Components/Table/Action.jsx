import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Action extends Webiny.Ui.Component {

    render() {
        return (
            <webiny-list-actions>{this.props.children}</webiny-list-actions>
        );
    }
}

export default Action;