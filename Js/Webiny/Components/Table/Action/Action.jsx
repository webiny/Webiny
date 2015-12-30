import Component from './../../../Lib/Component';

class Action extends Component {

    getActionEventName() {
        var event = 'Webiny.Components.Table';

        if (this.props.context.props.name) {
            event += '.' + this.props.context.props.name;
        }
        event += '.Action.' + this.getClassName();
        return event;
    }

    emitAction(data = this.props.data) {
        Webiny.EventManager.emit(this.getActionEventName(), data);
    }
}

export default Action;