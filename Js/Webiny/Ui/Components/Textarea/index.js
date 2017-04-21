import Webiny from 'Webiny';

class Textarea extends Webiny.Ui.FormComponent {

}

Textarea.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    delay: 400,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const props = {
            onBlur: this.validate,
            disabled: this.isDisabled(),
            className: 'form-control',
            value: this.props.value || '',
            placeholder: this.getPlaceholder(),
            style: this.props.style,
            onChange: this.props.onChange
        };
        
        const {DelayedOnChange} = this.props;
        
        return (
            <div className={this.classSet(cssConfig)}>
                {this.renderLabel()}
                <DelayedOnChange delay={this.props.delay}>
                    <textarea {...props}/>
                </DelayedOnChange>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Webiny.createComponent(Textarea, {modules: ['DelayedOnChange']});