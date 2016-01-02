import FormComponent from './../Base/FormComponent';
import HorizontalCreditCardExpiration from './HorizontalCreditCardExpiration';
import VerticalCreditCardExpiration from './VerticalCreditCardExpiration';

class CreditCardExpiration extends FormComponent {

    componentWillMount() {
        this.inputRef = Webiny.Tools.createUID();
    }

    render() {
        var formType = super.getFormType();

        var props = _.clone(this.props);
        props['ref'] = this.inputRef;

        if (formType == 'vertical') {
            return React.createElement(VerticalCreditCardExpiration, props, this.props.children);
        }

        if (formType == 'horizontal') {
            return React.createElement(HorizontalCreditCardExpiration, props, this.props.children);
        }

        return null;
    }
}

CreditCardExpiration.defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: '',
    grid: 12,
    name: null,
    type: 'text'
};

export default CreditCardExpiration;
