import Webiny from 'Webiny';

class Icon extends Webiny.Ui.Component {

}

Icon.defaultProps = {
    icon: null,
    className: null,
    type: 'span', // span || i
    renderer() {
        const {icon, className, type, onClick} = this.props;
        let iconSet = 'icon';
        if (_.includes(icon, 'fa-')) {
            iconSet = 'fa icon';
        }

        const classes = this.classSet(iconSet, icon, className);

        return React.createElement(type, {className: classes, onClick});
    }
};

export default Webiny.createComponent(Icon);