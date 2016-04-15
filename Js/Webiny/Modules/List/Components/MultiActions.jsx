import Webiny from 'Webiny';

class MultiActions extends Webiny.Ui.Component {

    render() {
        return (
            <webiny-list-multi-actions>{this.props.children}</webiny-list-multi-actions>
        );
    }
}

export default MultiActions;