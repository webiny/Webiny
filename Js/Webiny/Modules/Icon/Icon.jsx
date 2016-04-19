import Webiny from 'Webiny';

class Icon extends Webiny.Ui.Component {

}

Icon.defaultProps = {
    type: 'span', // span || i
    renderer() {
        return React.createElement(this.props.type, {className: this.classSet('icon ' + this.props.icon, this.props.className)});
    }
};

export default Icon;