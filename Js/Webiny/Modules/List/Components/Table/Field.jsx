import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Field extends Webiny.Ui.Component {

}

Field.defaultProps = {
    renderer: function renderer() {
        const classes = this.classSet({
            sorted: this.props.sorted !== null,
            'text-left': this.props.align === 'left'
        });

        return (
            <td className={classes}>{this.props.data[this.props.name]}</td>
        );
    }
};

export default Field;