import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
	renderer() {
		let icon = null;
		if (this.props.icon) {
			icon = <div className="ico"><i className={this.props.icon}></i></div>;
		}

		const classes = this.classSet('tile-header', this.props.className);
		return (
			<div className={classes} style={this.props.style || null}>
                {icon} <div className="title">{this.props.title}</div>
                {this.props.children}
			</div>
		);
	}
};

export default Header;