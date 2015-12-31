import Action from './Action';

class MultiAction extends Action {

    emitAction(data = this.props.data) {
        if (_.isString(this.props.callback)) {
            data.value = data.action;
            data.action = this.props.callback;
        }
        Webiny.Dispatcher.emit(this.getActionEventName(), data);
    }

    render() {

        var [Form,Grid] = this.inject('Form,Grid');

        var options = {};
        _.forEach(this.props.actions.props.children, item => {
            options[item.type] = item.props.children;
        });

        var selected = [];
        _.forEach(this.props.context.state.multiActions.selected, (value, key) => {
            if (value) {
                selected.push(key);
            }
        });

        var actionParams = {
            action: this.props.context.state.multiActions.action,
            selected: selected
        };

        var label = this.props.label || 'Apply';
        var placeholder = this.props.placeholder || 'Select action';

        return (
            <div className="multi-actions-wrapper">
                <Form.Select2 valueLink={this.props.context.linkState('multiActions.action')}
                              name="multiActionSelector" placeholder={placeholder} options={options}/>
                &nbsp;
                <Form.Button disabled={!this.props.context.state.multiActions.action || !selected.length}
                             onClick={this.emitAction.bind(this, actionParams)} type="primary">{label}</Form.Button>
            </div>
        );
    }
}

export default MultiAction;