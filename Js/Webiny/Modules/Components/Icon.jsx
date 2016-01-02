import Component from './../../Lib/Core/Component';

class Icon extends Component {

	render() {
        var type = Icon.Type[this.props.type] ? Icon.Type[this.props.type] : this.props.type;
		return <i className={this.classSet(type, this.props.className)}></i>;
	}
}

/* Alphabetically ordered */
Icon.Type = {
    ALERT: 'fa fa-warning',
    BAN: 'fa fa-ban',
    BARS: 'fa fa-bars',
    BOOK: 'fa fa-book',
    CALENDAR: 'fa fa-calendar',
    CARET_UP: 'fa fa-caret-up',
    CARET_DOWN: 'fa fa-caret-down',
    CARET_LEFT: 'fa fa-caret-left',
    CARET_RIGHT: 'fa fa-caret-right',
    CHECK: 'fa fa-check',
    CROSSHAIR: 'fa fa-crosshairs',
    DASHBOARD: 'fa fa-dashboard',
    DIAMOND: 'fa fa-fw fa-diamond',
    EDIT: 'fa fa-fw fa-edit',
	ENVELOPE: 'fa fa-envelope-o',
    FORM: 'fa fa-edit',
    GEAR: 'fa fa-gear',
    HOME: 'glyphicon glyphicon-home',
    INFO_CIRCLE: 'fa fa-info-circle',
    KEY: 'fa fa-key',
	LOCK: 'fa fa-lock',
    MINUS: 'fa fa-minus',
    PENCIL: 'fa fa-pencil',
    PLUS: 'fa fa-plus',
    SEARCH: 'fa fa-search',
    SORT_ASC: 'fa fa-sort-asc',
    SORT_DESC: 'fa fa-sort-desc',
    SORT_NONE: 'fa fa-sort',
    TABLE: 'fa fa-table',
	TEXT_FILE: 'fa-file-text-o',
    USER: 'glyphicons glyphicons-user'
};

export default Icon;