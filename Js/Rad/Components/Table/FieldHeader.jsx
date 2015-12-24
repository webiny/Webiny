/**
 * Generates sort links in table header - links don't trigger the actual sorting,
 * they are just here so user can refresh the page and get the same data again
 * @returns {*}
 */

function getThProps(field) {
	return {
		className: field.props.align ? 'text-' + field.props.align : 'text-center',
		key: 'table-th-' + field.props.name
	};
}

class FieldHeader {

	constructor(field, context) {
		this.field = field;
		this.context = context;

		this.sortDescIcon = Rad.Components.Icon.Type.SORT_DESC;
		this.sortAscIcon = Rad.Components.Icon.Type.SORT_ASC;
		this.sortNoneIcon = Rad.Components.Icon.Type.SORT_NONE;
	}

	render() {
		let fieldProps = _.clone(this.field.props);
		if (!fieldProps.sort) {
			return <th {...getThProps(this.field)}>{fieldProps.label}</th>;
		}

		// Check in meta if given sorter is applied
		// Returns order (-1 or 1) if yes, otherwise undefined
		var sortOrder = this.context.props.meta.sorter[fieldProps.sort];

		if (sortOrder && sortOrder > 0) {
			fieldProps.sort = '-' + fieldProps.sort;
		}

		var icon;
		switch (sortOrder) {
			case -1:
				icon = this.sortDescIcon;
				break;
			case 1:
				icon = this.sortAscIcon;
				break;
			default:
				icon = this.sortNoneIcon;
		}

		var linkProps = {
			route: Rad.Router.getActiveRoute().getName(),
			params: {sort: fieldProps.sort}
		};

		if (this.context.props.context.urlParams) {
			return (
				<th {...getThProps(this.field)}>
					<Rad.Components.Router.Link {...linkProps}>{fieldProps.label}</Rad.Components.Router.Link>
					&nbsp;
					<Rad.Components.Icon type={icon}/>
				</th>
			);
		}

		return (
			<th {...getThProps(this.field)}>
				<Rad.Components.Router.Link
					onClick={this.context.props.context.listChangeSort.bind(null, {sort: fieldProps.sort})}>{fieldProps.label}</Rad.Components.Router.Link>
				&nbsp;
				<Rad.Components.Icon type={icon}/>
			</th>
		);
	}

}

export default FieldHeader;