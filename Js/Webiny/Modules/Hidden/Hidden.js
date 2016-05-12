import Webiny from 'Webiny';

class Hidden extends Webiny.Ui.FormComponent {
}

Hidden.defaultProps = {
    renderer() {
        return null;
    }
};

export default Hidden;