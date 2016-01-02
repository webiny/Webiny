import Component from './../Core/Core/Component';

class Step extends Component {

	render() {

		let onClick = (e) => {
			this.props.onClick(this, this.props.index, e);
			if (!e.isDefaultPrevented()) {
				this.props.parent.selectStep(this.props.index);
			}
		};

		let stepDone = this.props.activeIndex == this.props.index && this.props.done;

		let headerClass = this.classSet({
			first: this.props.index == 0,
			current: this.props.activeIndex == this.props.index,
			done: this.props.submitted || stepDone,
			disabled: !this.props.isClickable
		}, this.props.className);

		return (
			<li className={headerClass}>
				<a onClick={this.props.isClickable ? onClick : null}>
					<span className="number">{this.props.number}</span>
					<i className="demo-icon icon-accept_icon"></i>
					{this.props.label}
				</a>
			</li>
		);
	}
}

Step.defaultProps = {
	label: '',
	beforeNext: null,
	onEnter: null,
	className: null,
	hide: false,
	onClick: _.noop,
	goBack: true,

	// Passed internally from Wizard
	index: 0, // Step index
	number: 0, // Step index
	activeIndex: 0, // Active step index
	isClickable: false, // Is step clickable?
	unlocked: false, // Was this step visited already?
	submitted: false, // Was this step submitted already?
	parent: null // Wizard component
};

class Wizard extends Component {

	constructor() {
		super();

		this.state = {
			activeIndex: 0,
			showLoader: false,
			finished: false
		};

		this.steps = [
			{submitted: false}
		];

		this.bindMethods('selectStep', 'nextStep', 'prevStep');
	}

	componentDidUpdate(){
		let step = this.steps[this.state.activeIndex];
		let onEnter = step.onEnter;
		if(onEnter && !step.onEnterExecuted){
			step.onEnterExecuted = true;
			onEnter();
		}
	}

	selectStep(index) {
		if(isNaN(index)){
			console.warn('Attempting to select invalid wizard step', index);
			return;
		}
		this.setState({activeIndex: index});
	}

	processBeforeNext() {
		let beforeNext = this.steps[this.state.activeIndex].beforeNext;
		if (!_.isFunction(beforeNext)) {
			return Q(true);
		}

		this.setState({showLoader: true});
		return Q(beforeNext(...arguments)).then(res => {
			this.setState({showLoader: false});
			return res;
		});
	}

	nextStep() {
		this.steps[this.state.activeIndex].submitted = true;
		this.steps[this.state.activeIndex].onEnterExecuted = false;

		if (this.isLastStep()) {
			return this.processBeforeNext(...arguments).then(res => {
				if (res) {
					this.setState({finished: true});
					this.props.onCompleted();
				}
			});
		}

		return this.processBeforeNext(...arguments).then(res => {
			if (res) {
				let nextStep = this.getNextStep();
				this.setState({activeIndex: nextStep});
			}
		});
	}

	isLastStep() {
		return _.findLastIndex(this.steps, 'hide', false) == this.state.activeIndex;
	}

	prevStep() {
		if (this.state.activeIndex > 0) {
			this.setState({activeIndex: this.getPrevStep()});
		}
	}

	getNextStep() {
		for (let i = this.state.activeIndex + 1; i <= this.steps.length; i++) {
			let step = this.steps[i];
			if (!step.hide) {
				return i;
			}
		}
	}

	getPrevStep() {
		for (let i = this.state.activeIndex - 1; i >= 0; i--) {
			let step = this.steps[i];
			if (!step.hide) {
				return i;
			}
		}
	}

	allPrevStepsSubmitted(index) {
		for (let i = index - 1; i >= 0; i--) {
			if (!this.steps[i].hide && !this.steps[i].submitted) {
				return false;
			}
		}

		return true;
	}

	render() {
		let [Form, Hide] = this.inject('Form, Hide');

		let stepsHeader = [];
		let activeStep = null;

		React.Children.map(this.props.children, (child, index) => {

			let step = _.get(this.steps, index, {submitted: false});
			step.hide = child.props.hide;
			step.beforeNext = child.props.beforeNext;
			step.onEnter = child.props.onEnter;
			if(index != this.state.activeIndex){
				step.onEnterExecuted = false;
			}
			step.goBack = child.props.goBack;

			this.steps[index] = step;

			if (step.hide) {
				return;
			}

			let unlocked = this.props.unlockAll || this.allPrevStepsSubmitted(index);

			let props = {
				key: index,
				index: index,
				number: stepsHeader.length + 1,
				activeIndex: this.state.activeIndex,
				isClickable: this.props.goBack && this.props.switchOnClick ? unlocked : false,
				parent: this,
				unlocked: unlocked,
				submitted: _.get(this.steps, index + '.submitted', false),
				goBack: child.props.goBack,
				done: child.props.done
			};

			let stepElement = React.cloneElement(child, props, child.props.children);
			stepsHeader.push(stepElement);

			if (index === this.state.activeIndex) {
				activeStep = stepElement;
			}
		});

		let content = null;
		let actions = null;

		React.Children.map(activeStep.props.children, child => {
			if(child.type == 'content'){
				content = child.props.children;
			}

			if(child.type == 'actions'){
				actions = child.props.children;
			}
		});

		if(this.props.layout == 'custom'){
			return React.cloneElement(content, {key: this.state.activeIndex});
		}

		return (
			<div className="wizard steps-bg steps-justified steps-left solo clearfix">
				{this.state.showLoader ? <Webiny.Ui.Components.Loader/> : null}
				<Hide if={this.props.noHeader}>
					<div className="steps clearfix">
						<ul>{stepsHeader}</ul>
					</div>
				</Hide>

				<div className="content clearfix">
					{React.cloneElement(content, {renderer: (form) => form.fields, key: this.state.activeIndex})}
				</div>
				<Hide if={this.props.noFooter}>
					<div className="actions clearfix">
						<Webiny.Ui.Components.Hide if={this.state.activeIndex == 0 || !this.props.goBack || !activeStep.props.goBack}>
							<button onClick={this.prevStep} type="button" className="btn btn-prev">
								<i className="demo-icon icon-prev_icon"></i> Previous
							</button>
						</Webiny.Ui.Components.Hide>
						{actions}
					</div>
				</Hide>
			</div>
		);
	}
}

Wizard.defaultProps = {
	name: _.uniqueId('wizard-'),
	noHeader: false,
	noFooter: false,
	goBack: true,
	switchOnClick: true,
	unlockAll: false,
	onCompleted: _.noop,
	onCancel: null,
	layout: 'default'
};

export default {
	Step,
	Wizard
};
