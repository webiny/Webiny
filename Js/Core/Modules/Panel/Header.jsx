import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    renderer() {
        let icon = null;
        if (this.props.icon) {
            icon = <span className="panel-icon"><i className={this.props.icon}></i></span>;
        }

        const classes = this.classSet('panel-header panel-header--gray-bg', this.props.className);
        return (
            <div className={classes} style={this.props.style || null}>
                {icon} {this.props.title}
                {this.props.children}
            </div>
        );
    }
};

export default Header;