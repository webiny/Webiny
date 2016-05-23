import Webiny from 'Webiny';

class Divider extends Webiny.Ui.Component {

}

Divider.defaultProps = {
    renderer() {
        return <li role="presentation" className="divider"></li>;
    }
};

export default Divider;
