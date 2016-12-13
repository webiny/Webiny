import Webiny from 'Webiny';
import SimpleTags from './SimpleTags';

class Tags extends Webiny.Ui.FormComponent {

}

Tags.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    validateTags: null,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const props = {
            onBlur: this.validate,
            className: 'form-control form-group--keywords',
            value: this.props.value,
            onChange: this.props.onChange,
            placeholder: this.getPlaceholder(),
            style: this.props.style,
            mode: this.props.mode,
            validateTags: this.props.validateTags,
            readOnly: _.get(this.props, 'readOnly', false)
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {this.renderLabel()}
                <SimpleTags {...props}/>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Tags;