import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Action extends Webiny.Ui.Component {

}

Action.defaultProps = {
    renderer: function renderer() {
        return (
            <li>
                <a tabIndex="-1" href="javascript:void(0);">{this.props.label}</a>
            </li>
        );
    }
};

export default Action;