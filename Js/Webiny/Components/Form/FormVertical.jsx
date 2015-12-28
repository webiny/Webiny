import Component from './../../Lib/Component';

import FormValidator from './Validation/FormValidator';

class FormVertical extends Component {

	constructor() {
		super();

		this.$isValid = null;
		this.fields = [];
		this.actions = [];
		this.layout = null;
		this.submitCallback = null;

		this.bindMethods('submit', 'getFormType', 'attachToForm', 'attachValidators', 'detachFromForm', 'validateInput', 'validateForm');
	}

	getFormType() {
		return 'vertical';
	}

	getValueLink(name) {
		return this.props.context.linkState(this.props.data + '.' + name);
	}

	registerInput(input) {
		if (typeof input !== 'object' || input === null) {
			return input;
		}

		var newProps = {
			attachToForm: this.attachToForm,
			attachValidators: this.attachValidators,
			detachFromForm: this.detachFromForm,
			validateInput: this.validateInput,
			form: this
		};

		if (input.props && input.props.name) {
			newProps['valueLink'] = this.getValueLink(input.props.name);
			return React.cloneElement(input, newProps, input.props && input.props.children);
		}
		return React.cloneElement(input, input.props, this.registerInputs(input.props && input.props.children));
	}

	registerInputs(children) {
		if (typeof children !== 'object' || children === null) {
			return children;
		}
		return React.Children.map(children, this.registerInput, this);
	}

	parseForm(children) {
		if (typeof children !== 'object' || children === null) {
			return;
		}

		return React.Children.map(children, child => {

			if (child.type == 'fields') {
				this.fields = this.registerInputs(child.props.children);
			}

			if (child.type == 'actions') {
				this.parseActions(child.props.children);
			}

			if (child.type == 'layout') {
				this.layout = child.props.children;
			}
		}, this);
	}

	parseActions(actions) {
		var actionTypes = ['Submit', 'Reset', 'Cancel'];
		this.actions = React.Children.map(actions, child => {
			if (_.isNull(child)) {
				return null;
			}
			if (actionTypes.indexOf(child.type.name) > -1) {
				var onClick = null;
				if (child.type.name == 'Submit') {
					onClick = (e) => {
						e.preventDefault();
						if (child.props.onClick) {
							this.submitCallback = child.props.onClick;
						}
						this.submit(e);
					};
				}

				if (child.type.name == 'Cancel') {
					onClick = () => {
						this.props.onCancel(this);
					};
				}

				if (child.type.name == 'Reset') {
					onClick = () => {
						this.reset();
						this.props.onReset(this);
					};
				}

				return React.cloneElement(child, {
					onClick: onClick,
					form: this
				}, child.props && child.props.children);
			}

			return this.registerInput(child);
		}, this);
	}

	getFormClass() {
		return '';
	}

	getFormHeaderTitle() {
		return this.props.headerTitle ? this.props.headerTitle : this.props.context.getHeaderTitle();
	}

	getFormHeaderIcon() {
		return this.props.headerIcon ? this.props.headerIcon : this.props.context.getHeaderIcon();
	}

	replacePlaceholders(element) {
		if (typeof element !== 'object' || element === null) {
			return element;
		}

		if (element.type == 'fields') {
			return this.fields;
		}

		if (element.type == 'actions') {
			var possibleActions = ['Submit', 'Cancel', 'Reset'];
			var actions = [];
			React.Children.map(this.actions, action  => {
				if (_.contains(possibleActions, action.type.name) && !_.has(element.props, action.type.name)) {
					return;
				}
				actions.push(action);
			});
			return actions;
		}

		if (element.props && element.props.children) {
			return React.cloneElement(element, element.props, React.Children.map(element.props.children, item => {
				return this.replacePlaceholders(item);
			}));
		}

		return element;
	}

	render() {
		this.parseForm(this.props.children);
		var [Panel,Grid] = this.inject('Panel,Grid');
		var loader = this.props.context.state.showLoader ? <Rad.Components.Loader/> : null;
		var css = this.getFormClass();

		if (this.layout) {
			var render = [];
			React.Children.map(this.layout, (item, index) => {
				render.push(React.cloneElement(this.replacePlaceholders(item), {key: index}));
			});

			return (
				<form id={this.props.id} autoComplete="off" className={css} onSubmit={this.submit} ref={this.props.name}
					  name={this.props.name}>
					{loader}
					{render}
					<button style={{position: 'absolute', left: '-5000px'}} type="submit"></button>
				</form>
			);
		}

		return (
			<form id={this.props.id} autoComplete="off" className={css} onSubmit={this.submit} ref={this.props.name}
				  name={this.props.name}>
				{loader}
				{this.props.renderer(this)}
				<button style={{position: 'absolute', left: '-5000px'}} type="submit"></button>
			</form>
		);
	}

	componentWillMount() {
		this.inputs = {};
		this.listen('Rad.Components.Form.Validate.' + this.props.name, () => {
			return this.validateForm();
		})
	}

	submit(e) {
		e.preventDefault();
		if (this.validateForm()) {
			this.submitCallback && this.submitCallback(this) || this.props.onSubmit(this);
		}
	}

	reset() {
		_.forIn(this.inputs, cmp => {
			cmp.component.setState({isValid: null});
		});
		this.$isValid = false;
	}

	isValid() {
		return this.$isValid;
	}

	attachValidators(props) {
		this.inputs[props.name].validators = FormValidator.parseValidateProperty(props.validate);
		this.inputs[props.name].messages = FormValidator.parseCustomValidationMessages(props.children);
	}

	attachToForm(component) {
		this.inputs[component.props.name] = {
			component: component,
			model: component.getValue()
		};
		this.attachValidators(component.props);
	}

	detachFromForm(component) {
		delete this.inputs[component.props.name];
	}

	validateInput(component) {
		var validators = this.inputs[component.props.name].validators;
		var hasValidators = Rad.Tools.keys(validators).length;
		var messages = this.inputs[component.props.name].messages;
		// Validate input
		return Q(FormValidator.validate(component.getValue(), validators, this.inputs)).then(result => {
			if (hasValidators) {
				var isValid = component.getValue() == null ? null : true;
				component.setState({isValid: isValid});
			}
			return component.getValue();
		}).catch(validationError => {
			// Set custom error message if defined
			var validator = validationError.validator;
			if (validator in messages) {
				validationError.setMessage(messages[validator]);
			}

			// Set component state to reflect validation error
			component.setState({
				isValid: false,
				validationError: validationError.message
			});

			return null;
		});
	}

	validateForm() {
		var allIsValid = true;

		var inputs = this.inputs;
		Object.keys(inputs).forEach(name => {
			var cmp = inputs[name].component;
			var hasValidators = inputs[name] && inputs[name].validators;
			var shouldValidate = (!cmp.hasValue() && cmp.isRequired()) || (cmp.hasValue() && cmp.state.isValid === false);

			if (hasValidators && shouldValidate) {
				if (cmp.state.isValid === false || cmp.state.isValid === null) {
					this.validateInput(cmp);
					allIsValid = false;
				}
			}
		});

		return allIsValid;
	}
}

FormVertical.defaultProps = {
	data: 'model',
	name: _.uniqueId('form-'),
	onSubmit: _.noop,
	onReset: _.noop,
	onCancel: _.noop,
	renderer: (form) => {
		let [Panel, Grid] = form.inject('Panel,Grid');
		return (
			<Panel.Panel>
				<Panel.Header title={form.getFormHeaderTitle()} icon={form.getFormHeaderIcon()}/>
				<Panel.Body style={{overflow: 'visible'}}>
					<Grid.Row>
						{form.fields}
					</Grid.Row>
				</Panel.Body>
				<Panel.Footer style={{padding: '0px 25px 25px'}}>{form.actions}</Panel.Footer>
			</Panel.Panel>
		);
	}
};

export default FormVertical;