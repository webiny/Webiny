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

        this.props.onSort(this.props.sort, sort);
    }
}

Header.defaultProps = {
    align: 'left',
    alignLeftClass: 'text-left',
    alignRightClass: 'text-right',
    alignCenterClass: 'text-center',
    sortedAscendingIcon: 'icon-caret-up',
    sortedDescendingIcon: 'icon-caret-down',
    sortableIcon: 'icon-sort',
    renderer() {
        const classes = {
            sorted: this.props.sorted && this.props.sorted !== 0
        };

        classes[this.props.alignLeftClass] = this.props.align === 'left';
        classes[this.props.alignRightClass] = this.props.align === 'right';
        classes[this.props.alignCenterClass] = this.props.align === 'center';

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
            <th className={this.classSet(classes)}>
                {this.props.children}
                {content}
            </th>
        );
    }
};

export default Header;