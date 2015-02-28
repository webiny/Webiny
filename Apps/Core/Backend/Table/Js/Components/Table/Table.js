import BaseComponent from '/Core/Base/BaseComponent';

class Table extends BaseComponent {

	getFqn() {
		return 'Core.Table.Table';
	}

	/**
	 * Construct CSS classes object to pass to this.classSet
	 * @returns {}
	 */
	getDynamicProperties() {
		var css = {
			'table': true
		};

		Object.assign(css, this.props['class-obj'] || {});

		return {
			css: css
		};
	}
}

export default Table;
