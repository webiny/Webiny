import Component from './../../Core/Core/Component';

class Label extends Component {

    render() {
        return <label>{this.props.children}</label>;
    }
}

export default Label;