import Component from './../../../Lib/Core/Component';

export class Tab extends Component {

	render() {
		let onClick = (e) => {
			this.props.onClick(this, this.props.index, e);
			if (!e.isDefaultPrevented()) {
				this.props.parent.selectTab(this.props.index);
			}
		};

		let active = {active: this.props.active};
		let tabSelectorClass = this.classSet(active, this.props.disabled ? 'disabled' : '');

		let label = this.props.label;
		if (_.isString(this.props.label)) {
			label = <a href="javascript:">{this.props.label}</a>;
		}

		if (this.props.render == 'tab') {
			return (
				<li className={tabSelectorClass} onClick={onClick}>{label}</li>
			);
		}

		let tabClass = this.classSet('tab-pane', active);

		if (!this.props.disabled && (this.props.active || this.props.alwaysRender)) {
			return (
				<div className={tabClass}>{this.props.children}</div>
			);
		}

		return null;
	}
}

Tab.defaultProps = {
	label: 'Tab',
	alwaysRender: true,
	disabled: false,
	onClick: _.noop,

	// The following props are passed from Tabs component
	render: 'tab', // tab or content,
	active: false,
	index: null,
	parent: null
};

export class Tabs extends Component {

	constructor() {
		super();
		this.tabs = [];
		this.state = {};

		this.bindMethods('selectTab');
	}

	selectTab(index) {
		this.setState({selected: index});
	}

	componentWillMount(){
		this.setState({selected: this.props.selected || 0});
	}

	componentWillReceiveProps(props){
		this.setState({selected: props.selected || this.state.selected});
	}

	render() {
		let css = this.classSet('tab-block', this.props.className);
		let tabsCss = this.classSet({
			'nav': true,
			'nav-tabs': this.props.position == 'top',
			'tabs-left': this.props.position == 'left',
			'tabs-right': this.props.position == 'right',
			'nav-tabs-right': this.props.align == 'right' && this.props.position != 'right',
			'nav-justified': this.props.align == 'justified',
			'tabs-bg': this.props.background
		});

		let tabsHeader = [];
		let tabsContent = [];

		React.Children.map(this.props.children, (child, index) => {
			let active = this.state.selected === index;

			let props = {
				key: index,
				index: index,
				active: active,
				parent: this
			};
			props.render = 'tab';
			tabsHeader.push(React.cloneElement(child, props, child.props.children));
			props.render = 'content';
			tabsContent.push(React.cloneElement(child, props, child.props.children));
		});

		let style = {};
		if (this.props.position == 'top') {
			style.overflow = 'visible';
		}

		return (
			<div className={css}>
				<ul className={tabsCss}>{tabsHeader}</ul>
				<div className="tab-content" style={style}>{tabsContent}</div>
			</div>
		);
	}
}

Tabs.defaultProps = {
	background: false, //
	position: 'top', // top, left, right
	align: 'left' // left, right, justified
};