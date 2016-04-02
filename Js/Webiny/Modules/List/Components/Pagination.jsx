import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Pagination extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('renderPages');
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.currentPage !== this.props.currentPage || nextProps.totalPages !== this.props.totalPages;
    }

    pageChanged(page) {
        if (page === this.props.currentPage) {
            return;
        }

        this.props.onPageChange(page);
    }

    renderPages() {
        const cp = this.props.currentPage;
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
            const className = this.props.currentPage === page ? 'active' : null;
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
    totalPages: 0,
    currentPage: 0,
    perPage: 0,
    count: 0,
    totalCount: 0,
    size: 'large', // large or small
    renderer: function render() {
        if(!this.props.count){
            return null;
        }

        const previousPage = this.props.currentPage === 1 ? null : this.pageChanged.bind(this, this.props.currentPage - 1);
        const previousClasses = this.classSet({
            previous: true,
            disabled: this.props.currentPage === 1
        });

        const nextPage = this.props.currentPage === this.props.totalPages ? null : this.pageChanged.bind(this, this.props.currentPage + 1);
        const nextClasses = this.classSet({
            next: true,
            disabled: this.props.currentPage === this.props.totalPages
        });

        return (
            <webiny-list-pagination>
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={12} className="text-right">
                        <ul className="pagination">
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