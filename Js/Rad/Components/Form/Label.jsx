import Component from './../../Lib/Component';

class Label extends Component {

    render() {
        return <label>{this.props.children}</label>;
    }
}

export default Label;