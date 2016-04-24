import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class MultiAction extends Webiny.Ui.Component {

}

MultiAction.defaultProps = {
    onAction: _.noop,
    renderer() {
        return (
            null
        );
    }
};

export default MultiAction;