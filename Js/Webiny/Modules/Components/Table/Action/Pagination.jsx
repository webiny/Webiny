import Action from './Action';

class Pagination extends Action {

    render() {
		var urlParams = this.props.context.props.context.urlParams;

        var props = {
            perPageInitial: urlParams ? Webiny.Router.getActiveRoute().getParams('perPage') : this.props.context.props.context.state.meta.perPage,
            data: this.props.data,
            className: this.props.className,
            onChangePerPage: newVal => this.props.context.props.context.listChangePerPage(newVal),
			onChangePage: params => this.props.context.props.context.listChangePage(params),
			onChangeSort: params => this.props.context.props.context.listChangeSort(params),
			urlParams: urlParams
        };

        return (
            <div className="pagination-wrapper">
                <Webiny.Ui.Components.Pagination {...props}/>
            </div>
        );
    }
}

export default Pagination;