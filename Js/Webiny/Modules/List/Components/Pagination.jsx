import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Pagination extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('renderPages');
    }

    pageChanged(page) {
        if (page === this.props.currentPage) {
            return;
        }

        this.props.onPageChange(page);
    }

    renderPages() {
        const cp = parseInt(this.props.currentPage);
        const tp = this.props.totalPages;
        let showLowDots = false;
        let showHighDots = false;
        const showPages = this.props.size === 'large' ? 9 : 7;
        const padding = this.props.size === 'large' ? 2 : 1;

        let pages = [];
        if (tp <= showPages) {
            pages = tp > 1 ? _.range(1, tp + 1) : [1];
        } else {
            if (cp - padding > 3) {
                showLowDots = true;
            }

            if (cp + (padding + 2) < tp) {
                showHighDots = true;
            }

            if (showLowDots && showHighDots) {
                pages = [1, null];
                let i = cp - padding;
                for (i; i <= cp + padding; i++) {
                    pages.push(i);
                }
                pages.push(null);
                pages.push(tp);
            } else if (showLowDots) {
                pages = _.range(tp - showPages + 3, tp + 1);
                pages.unshift(null);
                pages.unshift(1);
            } else if (showHighDots) {
                pages = _.range(1, showPages - 1);
                pages.push(null);
                pages.push(tp);
            }
        }

        return _.map(pages, (page, i) => {
            const key = page !== null ? page + '-' + i : 'dots-' + i;
            const onClick = page !== null ? this.pageChanged.bind(this, page) : null;
            const className = cp === page ? 'active' : null;
            return (
                <li key={key} className={className} onClick={onClick}>
                    <a href="javascript:void(0);">{page || '...'}</a>
                </li>
            );
        });
    }
}

Pagination.defaultProps = {
    onPageChange: _.noop,
    onPerPageChange: _.noop,
    totalPages: 0,
    currentPage: 0,
    perPage: 0,
    count: 0,
    totalCount: 0,
    size: 'large', // large or small
    renderer() {
        if (!this.props.count) {
            return null;
        }

        const cp = parseInt(this.props.currentPage);
        const previousPage = cp === 1 ? null : this.pageChanged.bind(this, cp - 1);
        const previousClasses = this.classSet({
            previous: true,
            disabled: cp === 1
        });

        const nextPage = cp === this.props.totalPages ? null : this.pageChanged.bind(this, cp + 1);
        const nextClasses = this.classSet({
            next: true,
            disabled: cp === this.props.totalPages
        });

        const perPage = (
            <Ui.Dropdown title={<span><strong>{this.props.perPage}</strong> per page</span>} className="balloon">
                <Ui.Dropdown.Header title="Results per page"/>
                <Ui.Dropdown.Link title="10" onClick={() => this.props.onPerPageChange(10)}/>
                <Ui.Dropdown.Link title="25" onClick={() => this.props.onPerPageChange(25)}/>
                <Ui.Dropdown.Link title="50" onClick={() => this.props.onPerPageChange(50)}/>
            </Ui.Dropdown>
        );

        return (
            <webiny-list-pagination>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12} className="text-right">
                        {perPage}
                        <ul className="pagination pull-right">
                            <li className={previousClasses} onClick={previousPage}>
                                <a href="javascript:void(0)">
                                    <span className="icon icon-caret-down"></span>
                                    <span>PREVIOUS</span>
                                </a>
                            </li>
                            {this.renderPages()}
                            <li className={nextClasses} onClick={nextPage}>
                                <a href="javascript:void(0)">
                                    <span>NEXT</span>
                                    <span className="icon icon-caret-down"></span>
                                </a>
                            </li>
                        </ul>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </webiny-list-pagination>
        );
    }
};

export default Pagination;