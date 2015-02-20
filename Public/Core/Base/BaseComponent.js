import BaseClass from '/Core/Base/BaseClass';
import ComponentFactory from '/Core/Component/ComponentFactory';
import Router from '/Core/Router/Router';
import Registry from '/Core/Registry';

/**
 * BaseComponent class is the main class all React components should inherit from.
 * It handles construction of a valid React class
 */
class BaseComponent extends BaseClass {

	constructor() {
		this.__listeners = [];
		this.__instanceId = Tools.createUID();
	}

	static createComponent() {
		return (new this).getComponent();
	}

	static createElement(props = {}) {
		if (!props.hasOwnProperty('key')) {
			props.key = Tools.createUID();
		}
		var cmp = (new this).getComponent();
		return React.createElement(cmp, props);
	}

	getInstanceId() {
		return this.__instanceId;
	}

	getFqn() {
		return this.getClassName();
	}

	getInitialState() {
		return {};
	}

	getDefaultProperties() {
		return {};
	}

	getDynamicProperties() {
		return {};
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	shouldComponentUpdate() {
		return true;
	}

	componentWillUpdate(nextProps, nextState) {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentWillMount() {

	}

	componentWillUnmount() {

	}

	getComponent() {
		return ComponentFactory.createComponent(this);
	}
}

export default BaseComponent;