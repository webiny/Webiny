import BaseCheckboxGroup from './BaseCheckboxGroup';

class HorizontalCheckboxGroup extends BaseCheckboxGroup {

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();
		let css = this.classSet('form-group', validationClass);

		if(validationIcon){
			validationIcon = React.cloneElement(validationIcon, {style: {top: '7px'}});
		}

		css = css.replace('label-left', '');

		let label = null;
		let errorCss = 'col-xs-12';
		let itemsCss = 'col-xs-12';
		if (this.props.label != '') {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
			itemsCss = "col-xs-8";
			errorCss = 'col-xs-8 col-xs-offset-4';
		}

		let items = this.getOptions();
		let classes = this.classSet(this.componentWrapperClass, {disabled: this.props.disabled});

        return (
			<div className={classes}>
				<div className={css}>{label}
					<div className={itemsCss}>
						{items}
					</div>
					{validationIcon}
				</div>
				<div className={errorCss}>
					{validationError}
				</div>
			</div>
		);
	}
}

export default HorizontalCheckboxGroup;