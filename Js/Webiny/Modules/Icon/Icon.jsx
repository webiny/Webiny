import Webiny from 'Webiny';

class Icon extends Webiny.Ui.Component {

}

Icon.defaultProps = {
    type: 'span', // span || i
    renderer() {
        let iconSet = 'icon';
        if (_.includes(this.props.icon, 'fa-')) {
            iconSet = 'fa icon';
        }

        return React.createElement(this.props.type, {className: this.classSet(iconSet + ' ' + this.props.icon, this.props.className)});
    }
};

export default Icon;