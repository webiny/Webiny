import Component from './../../../Core/Core/Component';

class Select extends Component {

    render() {
        var props = {
            disabled: this.props.disabled,
            name: this.props.name,
            label: this.props.label,
            valueLink: this.props.valueLink,
            form: this.props.form,
			componentWrapperClass: this.props.componentWrapperClass || null
        };

        props.options = {};
        for (var i = this.props.min; i <= this.props.max; i++) {
            props.options[i] = i;
        }

        return <Webiny.Ui.Components.Form.Select2 {...props}/>;
    }
}

Select.defaultProps = {
    min: 1,
    max: 5
};

export default Select;