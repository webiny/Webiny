import Component from './../../../Core/Core/Component';

class Submit extends Component {

	constructor() {
		super();

		this.enabled = true;
	}

	render() {
		var sizeClasses = {
			normal: '',
			large: 'btn-lg',
			small: 'btn-sm'
		};

		var classes = this.classSet(
			this.props.className,
			sizeClasses[this.props.size]
		);

		var props = _.clone(this.props);
		if (!this.enabled) {
			props['disabled'] = true;
		}

		if (this.props.route) {
			props.onClick = () => {
				Webiny.Router.goToRoute(this.props.route);
			};
		}

		return (
			<button {...props} className={classes} type="submit">
				{this.props.children ? this.props.children : this.props.label}
			</button>
		);
	}

	disable() {
		this.enabled = false;
	}

	enable() {
		this.enabled = true;
	}
}

Submit.defaultProps = {
	size: 'normal',
	className: 'btn btn-blue pull-right mr10'
};

export default Submit;