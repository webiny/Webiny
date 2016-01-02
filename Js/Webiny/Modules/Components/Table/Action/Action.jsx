import Component from './../../../../Lib/Core/Component';

class Action extends Component {

    getActionEventName() {
        var event = 'Webiny.Ui.Components.Table';

        if (this.props.context.props.name) {
            event += '.' + this.props.context.props.name;
        }
        event += '.Action.' + this.getClassName();
        return event;
    }

    emitAction(data = this.props.data) {
        Webiny.Dispatcher.dispatch(this.getActionEventName(), data);
    }
}

export default Action;