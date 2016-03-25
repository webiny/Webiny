import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class MultiActions extends Webiny.Ui.Component {

    render() {
        return (
            <webiny-list-multi-actions>{this.props.children}</webiny-list-multi-actions>
        );
    }
}

export default MultiActions;