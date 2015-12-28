import Component from './../../Lib/Component';

class Menu extends Component {

	componentWillMount() {
		this.setState({title: this.props.title});
	}

	assignProps(element, index) {
		return React.cloneElement(element, {parent: this, key: index});
	}


	render() {
		let sizeClasses = {
			normal: '',
			medium: 'btn-md',
			large: 'btn-lg',
			small: 'btn-sm'
		};

		let colorClasses = {
			blue: 'btn-blue',
			green: 'btn-green'
		};

		let btnClasses = this.classSet('btn dropdown-toggle', sizeClasses[this.props.size], colorClasses[this.props.color]);
		let wrapperClass = this.classSet('btn-group', this.props.color, this.props.className);

		let children = [];
		let defaultActions = [];
		React.Children.forEach(this.props.children, (item, index) => {
			if(item.props.default){
				defaultActions.push(
					<button onClick={item.props.onClick} key={index} type="button" className={btnClasses}>{item.props.label}</button>
				);
			} else {
				children.push(this.assignProps(item, index));
			}
		});

		let dropdownMenuClass = this.classSet('dropdown-menu', {
			'dropdown-menu-right': this.props.align == 'right'
		});

		return (
			<div className={wrapperClass}>
				{defaultActions}
				<button className={btnClasses} type="button" data-toggle="dropdown">
					{defaultActions.length ? this.props.title : this.props.placeholder}&nbsp;
					<span className="caret"></span>
				</button>
				<ul className={dropdownMenuClass}>
					{children}
				</ul>
			</div>
		);
	}
}

Menu.defaultProps = {
	colorClass: null,
	size: 'normal',
	color: 'blue',
	caretLabel: null,
	placeholder: 'Select action',
	align: 'right'
};

export default Menu;