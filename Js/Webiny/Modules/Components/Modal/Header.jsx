import Component from './../../../Lib/Core/Component';

class Header extends Component {
	render() {

		var classes = this.classSet('modal-header panel-header', this.props.className);
		var content = _.isString(this.props.children) ? <h2 className="modal-title">{this.props.children}</h2> : this.props.children;


		return <div className={classes}>
			<button type="button" className="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">×</span>
			</button>
			{content}
		</div>;
	}
}

export default Header;