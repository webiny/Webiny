import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Header extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('toggleSorter');
    }

    toggleSorter() {
        let sort = 0;
        switch (this.props.sorted) {
            case 0:
                sort = -1;
                break;
            case -1:
                sort = 1;
                break;
            default:
                sort = 0;
        }

        this.props.onSort(this.props.name, sort);
    }
}

Header.defaultProps = {
    renderer() {
        const classes = this.classSet({
            sorted: this.props.sorted && this.props.sorted !== 0,
            'text-left': this.props.align === 'left'
        });

        const sortIcon = {};
        sortIcon[this.props.sortedAscendingIcon] = this.props.sorted === 1;
        sortIcon[this.props.sortedDescendingIcon] = this.props.sorted === -1;
        sortIcon[this.props.sortableIcon] = this.props.sorted === 0;

        const icon = this.props.sortable ? <Ui.Icon icon={this.classSet(sortIcon)}/> : null;

        let content = this.props.label;
        if (this.props.sortable) {
            content = (
                <a href="javascript:void(0);" onClick={this.toggleSorter}>
                    {this.props.label}
                    {icon}
                </a>
            );
        }

        return (
            <th className={classes}>
                {this.props.children}
                {content}
            </th>
        );
    },
    sortedAscendingIcon: 'icon-caret-up',
    sortedDescendingIcon: 'icon-caret-down',
    sortableIcon: 'icon-sort'
};

export default Header;