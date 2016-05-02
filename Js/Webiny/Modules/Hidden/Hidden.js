import Webiny from 'Webiny';

class Hidden extends Webiny.Ui.Component {
}

Hidden.defaultProps = {
    renderer() {
		return null;
    }
};

export default Hidden;