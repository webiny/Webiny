import Webiny from 'Webiny';

class Field extends Webiny.Ui.Component {

	constructor(props) {
		super(props);

		this.bindMethods('getTdClasses');
	}

	getTdClasses(classes = {}) {
		const coreClasses = {};
		coreClasses[this.props.sortedClass] = this.props.sorted !== null;
		coreClasses[this.props.alignLeftClass] = this.props.align === 'left';
		coreClasses[this.props.alignRightClass] = this.props.align === 'right';
		coreClasses[this.props.alignCenterClass] = this.props.align === 'center';
		return this.classSet(coreClasses, this.props.className, classes);
	}
}

Field.defaultProps = {
	default: '-',
	sortedClass: 'sorted',
	alignLeftClass: 'text-left',
	alignRightClass: 'text-right',
	alignCenterClass: 'text-center',
	renderer() {
		return (
			<td className={this.getTdClasses()}>{_.get(this.props.data, this.props.name) || this.props.default}</td>
		);
	}
};

export default Field;