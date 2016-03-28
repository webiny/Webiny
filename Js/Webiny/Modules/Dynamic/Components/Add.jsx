import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Add extends Webiny.Ui.Component {

    render() {
        const button = React.Children.toArray(this.props.children)[0];
        const newProps = _.clone(button.props);
        newProps['onClick'] = this.props.onClick;
        return React.cloneElement(button, newProps);
    }
}

export default Add;