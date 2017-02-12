import Webiny from 'Webiny';

class Email extends Webiny.Ui.Component {
    constructor(props){
        super(props);

        this.bindMethods('focus');
    }

    focus() {
        this.refs.input.focus();
    }
}

Email.defaultProps = {
    renderer() {
        const props = _.omit(this.props, ['renderer']);
        if (props.onChange) {
            const realOnChange = props.onChange;
            props.onChange = (value) => {
                realOnChange(value ? value.toLowerCase() : value);
            };
        }

        const validate = _.get(props, 'validate');
        props.validate = validate ? validate + ',email' : 'email';

        return (
            <Webiny.Ui.Components.Input ref="input" {...props}/>
        );
    }
};

export default Email;
