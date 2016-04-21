import Webiny from 'Webiny';

class MultiActions extends Webiny.Ui.Component {

}

MultiActions.defaultProps = {
    renderer() {
        return (
            <webiny-list-multi-actions>{this.props.children}</webiny-list-multi-actions>
        );
    }
};

export default MultiActions;