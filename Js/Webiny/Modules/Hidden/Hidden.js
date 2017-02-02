import Webiny from 'Webiny';

// TODO: check if this component is needed at all

class Hidden extends Webiny.Ui.FormComponent {
}

Hidden.defaultProps = {
    renderer() {
        return null;
    }
};

export default Hidden;