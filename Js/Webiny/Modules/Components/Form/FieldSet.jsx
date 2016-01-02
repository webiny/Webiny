import Component from './../../Core/Core/Component';

class FieldSet extends Component {

    render() {
        return <fieldset {... this.props}>{this.props.children}</fieldset>;
    }
}

export default FieldSet;