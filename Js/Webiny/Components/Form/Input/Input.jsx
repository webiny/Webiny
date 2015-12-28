import FormComponent from './../Base/FormComponent';
import HorizontalInput from './HorizontalInput';
import VerticalInput from './VerticalInput';

class Input extends FormComponent {

    componentWillMount() {
        this.inputRef = Rad.Tools.createUID();
    }

    render() {
        var formType = super.getFormType();

        var props = _.clone(this.props);
        props['ref'] = this.inputRef;

        if (formType == 'vertical') {
            return React.createElement(VerticalInput, props, this.props.children);
        }

        if (formType == 'horizontal') {
            return React.createElement(HorizontalInput, props, this.props.children);
        }

        // Native input field
        return React.createElement('input', _.assign({}, props, {className: 'form-control'}));
    }

    getDOM() {
        return super.getDOM(this.inputRef);
    }
}

Input.defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: '',
    grid: 12,
    name: null,
    type: 'text'
};

export default Input;
