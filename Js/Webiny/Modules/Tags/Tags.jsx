import Webiny from 'Webiny';
import SimpleTags from './SimpleTags';

class Container extends Webiny.Ui.FormComponent {

}

Container.defaultProps = {
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;

        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

        const props = {
            onBlur: this.validate,
            className: 'form-control form-group--keywords',
            value: this.props.value,
            onChange: this.props.onChange,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            style: this.props.style,
            mode: this.props.mode,
            readOnly: _.get(this.props, 'readOnly', false)
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <SimpleTags {...props}/>
                <span className="help-block">{this.props.description}</span>
                {validationMessage}
            </div>
        );
    }
};

export default Container;