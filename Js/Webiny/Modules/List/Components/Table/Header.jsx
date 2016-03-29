import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Header extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            showInfo: false
        };

        this.bindMethods('toggleSorter,showInfo,hideInfo');
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

    showInfo() {
        this.setState({showInfo: true});
    }

    hideInfo() {
        this.setState({showInfo: false});
    }
}

Header.defaultProps = {
    renderer: function renderer() {
        const classes = this.classSet({
            sorted: this.props.sorted && this.props.sorted !== 0,
            'text-left': this.props.align === 'left'
        });

        const sortIcon = {};
        sortIcon[this.props.sortedAscendingIcon] = this.props.sorted === 1;
        sortIcon[this.props.sortedDescendingIcon] = this.props.sorted === -1;
        sortIcon[this.props.sortableIcon] = this.props.sorted === 0;

        const icon = this.props.sortable ? <i className={this.classSet(sortIcon)}></i> : null;

        let content = this.props.label;
        if (this.props.sortable) {
            content = (
                <a href="javascript:void(0);" onClick={this.toggleSorter}>
                    {this.props.label}
                    {icon}
                </a>
            );
        }

        let info = null;
        let modal = null;
        if (this.props.infoContent) {
            info = (
                <a onClick={this.showInfo} href="javascript:void(0);">
                    <span className="icon icon-info"></span>
                </a>
            );

            modal = (
                <Ui.Modal.Dialog show={this.state.showInfo}>
                    <Ui.Modal.Header title={this.props.infoTitle} onClose={this.hideInfo}/>
                    <Ui.Modal.Body children={this.props.infoContent}/>
                    <Ui.Modal.Footer>
                        <Ui.Button label="Close" onClick={this.hideInfo}/>
                    </Ui.Modal.Footer>
                </Ui.Modal.Dialog>
            );
        }

        return (
            <th className={classes}>
                {modal}
                {info}
                {content}
            </th>
        );
    },
    sortedAscendingIcon: 'icon-caret-up',
    sortedDescendingIcon: 'icon-caret-down',
    sortableIcon: 'icon-sort'
};

export default Header;