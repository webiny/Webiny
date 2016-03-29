import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Actions extends Webiny.Ui.Component {

}

Actions.defaultProps = {
    label: 'More',
    renderer: function renderer() {
        return (
            <div className="dropdown balloon">
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    {this.props.label}
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {this.props.children}
                </ul>
            </div>
        );
    }
};

export default Actions;