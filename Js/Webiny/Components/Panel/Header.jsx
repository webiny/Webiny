import Component from './../../Lib/Component';

class Header extends Component {

    render() {

        var icon = null;
        if (this.props.icon) {
            icon = <span className="panel-icon"><i className={this.props.icon}></i></span>;
        }

        return <div className="panel-header" style={this.props.style || null}>
            <h3>{icon} {this.props.title}</h3>
			{this.props.children}
        </div>;
    }
}

export default Header;