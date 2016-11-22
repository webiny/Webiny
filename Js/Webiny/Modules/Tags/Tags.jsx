import Webiny from 'Webiny';
import SimpleTags from './SimpleTags';

class Container extends Webiny.Ui.FormComponent {

}

Container.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
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

export default Container;