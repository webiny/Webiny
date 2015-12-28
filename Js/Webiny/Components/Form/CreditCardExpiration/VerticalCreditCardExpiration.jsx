import InputComponent from './../Base/InputComponent';
import Select2 from './../Select2/Select2';

let thisYear = parseInt(moment().format('YYYY'));
let thisMonth = parseInt(moment().format('MM'));

class VerticalCreditCardExpiration extends InputComponent {

	constructor() {
		super();

		_.assign(this.state, {
			model: {
				month: null,
				year: null
			}
		});

		this.bindMethods('getMonthsOptions,getYearsOptions,changed');
	}

	componentWillMount(){
		super.componentWillMount();
		this.setState({model: this.props.valueLink.value});
	}

	componentWillReceiveProps(props){
		super.componentWillReceiveProps(props);
		this.setState({model: props.valueLink.value});
	}

	getMonthsOptions() {
		return _.mapKeys(_.range(1, 13));
	}

	getYearsOptions() {
		let startYear = new Date().getFullYear();
		let endYear = startYear + 20;

		return _.mapKeys(_.range(startYear, endYear))
	}

	changed() {
		if (!this.state.model.month || !this.state.model.year) {
			return;
		}

		this.props.valueLink.requestChange(this.state.model);
		setTimeout(this.validate, 20);
	}

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();
		let css = this.classSet('form-group', validationClass);

		let label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

		return (
			<div className={this.getComponentWrapperClass()}>
				{this.props.renderer(this, {label, validationError, validationIcon, css})}
			</div>
		);
	}
}

VerticalCreditCardExpiration.defaultProps = {
	renderer: (_this, opts) => {
		let monthsOptions = _this.getMonthsOptions();
		let yearsOptions = _this.getYearsOptions();

		let monthsProps = {
			context: 'native',
			options: monthsOptions,
			valueLink: _this.linkState('model.month'),
			changed: _this.changed,
			placeholder: 'Month'
		};

		let yearsProps = {
			context: 'native',
			options: yearsOptions,
			valueLink: _this.linkState('model.year'),
			changed: _this.changed,
			minimumResultsForSearch: 50,
			placeholder: 'Year'
		};

		return (
			<div className={opts.css}>
				{opts.label}
				<div className="row">
					<div className="col-xs-6">
						<Select2 {...monthsProps}/>
					</div>
					<div className="col-xs-6 pln">
						<Select2 {...yearsProps}/>
					</div>
				</div>
				{opts.validationError}
				{opts.validationIcon}
			</div>
		);
	}
};

export default VerticalCreditCardExpiration;
