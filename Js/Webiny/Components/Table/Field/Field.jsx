import Component from './../../../Lib/Component';

class Field extends Component {

	constructor(){
		super();

		this.bindMethods('emitField');
	}

    emitField() {
        var event = 'Webiny.Ui.Components.Table';
		
        if (this.props.context.props.name) {
            event += '.' + this.props.context.props.name;
        }
        event += '.Field.' + this.getClassName();

        Webiny.Dispatcher.dispatch(event, {data: this.props.data, field: this.props.field});
    }
}

export default Field;