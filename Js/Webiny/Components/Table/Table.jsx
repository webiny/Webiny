import Component from './../../Lib/Component';
import Field from './Field';
import FieldHeader from './FieldHeader';
import Action from './Action';
import Pagination from './Action/Pagination';
import MultiAction from './Action/MultiAction';

function getTableParams(children) {
	var params = {};
	children.forEach(child => {
		if (!params[child.type]) {
			params[child.type] = [];
		}
		params[child.type].push(child);
	});
	return params;
}

function getTrKey(row) {
	return 'table-tr-' + row.id
}

/**
 * Table class
 */
class Table extends Component {

	constructor() {
		super();
		this.noResultsMessage = 'No results to show.';

		this.state = {
			multiActions: {
				selected: {},
				all: false,
				action: false
			}
		};

	}

	onChangeMultiActionsAll(allSelected) {
		var selected = {};
		if (allSelected) {
			var resultSetIds = _.pluck(this.props.context.props.data, 'id');
			resultSetIds.forEach(id => {
				selected[id] = true;
			});
		}

		this.setState('multiActions.selected', selected);
	}

	outputTableHead(params) {
		if (!this.props.header) {
			return null;
		}

		var actions = params.action ? <th className="text-center">Actions</th> : null;

		return (
			<thead>
			<tr>
				{params['multi-actions'] ? (
					<th className="multi-select pln prn">
						<Webiny.Ui.Components.Form.Checkbox valueLink={this.linkState('multiActions.all')}/>
					</th>
				) : null}

				{params.field.map(field => {
					if (this.props.context.props.fields.indexOf(field.props.name) == -1) {
						return null;
					}
					return new FieldHeader(field, this.props.context).render();
				})}
				{actions}
			</tr>
			</thead>
		);
	}

	outputTableBody(params) {
		var body;

		if (_.isEmpty(this.props.context.props.data)) {
			body = this.outputNoResults()
		} else {
			body = this.props.context.props.data.map(data => {
				return this.outputRow(data, params);
			});
		}
		return <tbody>{body}</tbody>;
	}

	/**
	 * When receiving new data, (eg. switching pages or sorting by another field), let's reset
	 * "all" and "selected" for multiActions since we are not working with the same result-set anymore
	 */
	componentWillReceiveProps() {
		if (_.keys(this.state.multiActions.selected).length || this.state.multiActions.all) {
			var multiActions = _.clone(this.state.multiActions);
			multiActions.all = false;
			multiActions.selected = {};
			this.setState({multiActions});
		}
	}

	/**
	 * When clicking on checkboxes for multi-actions, here we check if user clicked "All" in table header,
	 * and then if he then removed a row from the selection. If true, we can also remove the checked
	 * status from the "All" since all rows aren't selected now
	 */
	componentWillUpdate() {
		var allSelected = this.state.multiActions.all;
		var rowsCount = _.size(this.props.context.props.data);

		var rowsSelected = 0;
		_.forEach(this.state.multiActions.selected, value => {
			if (value) {
				rowsSelected++;
			}
		});

		if (allSelected && rowsCount != rowsSelected) {
			this.setState('multiActions.all', false);
		}

	}

	outputMultiActions(params) {
		if (!params['multi-actions']) {
			return null;
		}

		return React.Children.map(params['multi-actions'], item => {
			var props = {
				context: this,
				actions: item,
				label: _.get(item, 'props.label'),
				placeholder: _.get(item, 'props.placeholder'),
				callback: _.get(item, 'props.callback')
			};

			return <MultiAction key={_.uniqueId('multi-action-')} {...props}/>;
		});
	}

	/**
	 * First we output all fields and then actions
	 * @param row
	 * @param params
	 * @returns {Array}
	 */
	outputRow(row, params) {

		var output = [];

		output.push(
			<tr key={getTrKey(row)}>

				{params['multi-actions'] ? (
					<td className="multi-select pln prn">
						<Webiny.Ui.Components.Form.Checkbox valueLink={this.linkState('multiActions.selected.' + row.id)}/>
					</td>
				) : null}

				{params.field.map(field => {
					if (this.props.context.props.fields.indexOf(field.props.name) == -1) {
						return null;
					}
					return new Field(row, field, this.props.context, this).render();
				})}

				{params.action ? (
					<td className="text-center">
						{params.action && params.action.map(action => {
							if (this.props.context.props.actions.indexOf(action.props.name) == -1) {
								return null;
							}

							if (_.has(action.props, 'hide') && action.props.hide(row)) {
								return null;
							}

							if (_.has(action.props, 'show') && !action.props.show(row)) {
								return null;
							}

							return new Action(row, action, this.props.context, this).render();
						})}
					</td>
				) : (null)}
			</tr>
		);

		return output;
	}

	outputNoResults() {
		return (
			<tr>
				<td className="text-center" colSpan={this.props.context.props.fields.length + 1}>
					<Webiny.Ui.Components.Icon type={Webiny.Ui.Components.Icon.Type.INFO_CIRCLE}/>&nbsp;
					{this.noResultsMessage}
				</td>
			</tr>
		);
	}

	render() {
		var params = getTableParams(this.props.children);

		params.classNames = {
			table: '',
			pagination: ''
		};

		if (this.props.className) {
			if (_.isString(this.props.className)) {
				params.classNames.table = this.props.className;
			} else {
				params.classNames = _.merge(params.classNames, this.props.className);
			}
		}

		var pagination = null;
		if (this.props.pagination !== false) {
			pagination =
				<Pagination data={this.props.context.props.meta} context={this.props.context} className={params.classNames.pagination}/>;
		}

		return (
			<div className="table-wrapper">
				<div>
					<table className={this.classSet('table', params.classNames.table)}>
						{this.outputTableHead(params)}
						{this.outputTableBody(params)}
					</table>
				</div>
				<div className="mt20">
					{this.outputMultiActions(params)}
					{pagination}
				</div>
			</div>
		);
	}
}

Table.defaultProps = {
	header: true,
	pagination: true,
	className: false
};

export default Table;