import Component from './../../../Lib/Component';

class Country extends Component {

    render() {
        var props = {
            name: this.props.name,
            label: this.props.label,
            valueLink: this.props.valueLink,
            form: this.props.form,
            options: Webiny.Ui.Components.Countries,
            className: this.props.className,
            componentWrapperClass: this.props.componentWrapperClass
        };

        return <Webiny.Ui.Components.Form.Select2 {...props}/>
    }
}

Country.defaultProps = {
    name: 'country',
    label: 'Country'
};

export default Country;