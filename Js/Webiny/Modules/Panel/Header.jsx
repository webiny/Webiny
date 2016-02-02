import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    renderer: function renderer() {

        let icon = null;
        if (this.props.icon) {
            icon = <span className="panel-icon"><i className={this.props.icon}></i></span>;
        }

        return (
            <div className="panel-header" style={this.props.style || null}>
                {icon} {this.props.title}
                {this.props.children}
            </div>
        );
    }
};

export default Header;