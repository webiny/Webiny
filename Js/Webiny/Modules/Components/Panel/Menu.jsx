import Component from './../../../Lib/Core/Component';

class Menu extends Component {

    render() {
        return <div className="panel-menu">{this.props.children}</div>;
    }
}

export default Menu;