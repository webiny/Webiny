import Webiny from 'Webiny';

class Field extends Webiny.Ui.Component {

    constructor(props){
        super(props);

        this.bindMethods('getTdClasses');
    }

    getTdClasses(classes = {}) {
        return this.classSet(_.merge({
            sorted: this.props.sorted !== null,
            'text-left': this.props.align === 'left'
        }, classes));
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