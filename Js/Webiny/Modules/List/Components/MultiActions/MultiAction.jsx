import Webiny from 'Webiny';

class MultiAction extends Webiny.Ui.Component {

}

MultiAction.defaultProps = {
    onAction: _.noop,
    renderer() {
        return null;
    }
};

export default MultiAction;