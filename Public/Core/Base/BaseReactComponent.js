class BaseReactComponent {

	constructor(props) {
		super(props);

		this.state = this.getInitialState();
		// Auto-bind user defined methods
		Object.keys(this.__proto__).forEach(property => {
			if (typeof this[property] == 'function') {
				this[property] = this[property].bind(this);
			}
		});

		console.log("BaseReactComponent", this);
	}
}

export default BaseReactComponent;