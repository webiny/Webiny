import Webiny from 'Webiny';

class Menu extends Webiny.Ui.Component {

}

Menu.defaultProps = {
    renderer() {
        return <div className="panel-menu">{this.props.children}</div>;
    }
};

export default Menu;