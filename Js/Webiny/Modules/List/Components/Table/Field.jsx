import Webiny from 'Webiny';

class Field extends Webiny.Ui.Component {

    constructor(props){
        super(props);

        this.bindMethods('getTdClasses');
    }

    getTdClasses() {
        return this.classSet({
            sorted: this.props.sorted !== null,
            'text-left': this.props.align === 'left'
        });
    }
}

Field.defaultProps = {
    renderer: function renderer() {
        return (
            <td className={this.getTdClasses()}>{this.props.data[this.props.name]}</td>
        );
    }
};

export default Field;