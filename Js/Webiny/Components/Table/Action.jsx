function getActionKey(action) {
	return 'table-tr-td-action-' + action.props.name + '-' + _.uniqueId();
}

class Action {

	constructor(row, action, context, table) {
		this.row = row;
		this.action = action;
		this.context = context;
		this.table = table;
	}

	render() {
		var renderMethodName = 'action' + _.capitalize(this.action.props.name);
		if (this.context[renderMethodName]) {
			var element = this.context[renderMethodName](this.row, this);
			if (element == null) {
				return null;
			}
			return React.cloneElement(element, {
				context: this.context,
				key: getActionKey(this.action)
			}, element.props.children);
		}

		var Action = Webiny.Components.Table.Action[_.capitalize(this.action.props.name)];

		if (Action) {
			var props = {
				label: this.action.props.label || null,
				key: getActionKey(this.action),
				data: this.row,
				context: this.context,
				table: this.table,
                children: this.action.props.children
			};

			return (
				<Action {...props}></Action>
			);
		}
		return null;
	}

}

export default Action;