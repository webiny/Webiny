import Component from './../../../Lib/Component';

class Country extends Component {

    render() {
        var props = {
            name: this.props.name,
            label: this.props.label,
            valueLink: this.props.valueLink,
            form: this.props.form,
            options: Rad.Components.Countries,
            className: this.props.className,
            componentWrapperClass: this.props.componentWrapperClass
        };

        return <Rad.Components.Form.Select2 {...props}/>
    }
}

Country.defaultProps = {
    name: 'country',
    label: 'Country'
};

export default Country;