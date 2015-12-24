import Component from './../../../Lib/Component';

class Action extends Component {

    getActionEventName() {
        var event = 'Rad.Components.Table';

        if (this.props.context.props.name) {
            event += '.' + this.props.context.props.name;
        }
        event += '.Action.' + this.getClassName();
        return event;
    }

    emitAction(data = this.props.data) {
        Rad.EventManager.emit(this.getActionEventName(), data);
    }
}

export default Action;