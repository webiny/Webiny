import Component from './../Lib/Component';

class Pagination extends Component {

	constructor() {
		super();
		this.state = {
			perPage: false
		};
	}

	setupComponent(props) {
		if (props.perPageOptions === false) {
			return;
		}

		var perPage = _.clone(props.perPageInitial);
		var perPageOptions = _.clone(props.perPageOptions).split(',');
		if (!perPage || !_.contains(perPageOptions, perPage.toString())) {
			perPage = _.first(perPageOptions)
		}
		this.setState({perPage});
	}

	componentWillMount() {
		this.setupComponent(this.props);
	}

	componentWillReceiveProps(props) {
		this.setupComponent(props);
	}

	renderPage(page) {
		var pageHref = Rad.Router.getActiveRoute().getHref({page: page});
		return (
			<li key={'table-page-' + page} className={this.props.data.currentPage == page ? 'active' : ''}>
				{this.props.urlParams ? <a href={pageHref}>{page}</a> :
					<a href="javascript:" onClick={this.props.onChangePage.bind(this, {page})}>{page}</a>}
			</li>
		);
	}

	renderPreviousPageLink() {
		var params = {page: this.props.data.currentPage - 1};
		var disabled = this.props.data.currentPage == 1;

		if (this.props.urlParams) {
			var route = Rad.Router.getActiveRoute().name;
			return (
				<li className={disabled ? 'disabled' : ''}>
					<Rad.Components.Router.Link route={route} params={params} disabled={disabled}>
						<span aria-hidden="true">Prev</span>
					</Rad.Components.Router.Link>
				</li>
			);
		}

		return (
			<li className={disabled ? 'disabled' : ''}>
				<Rad.Components.Router.Link onClick={disabled ? _.noop : this.props.onChangePage.bind(this, params)}>
					<span aria-hidden="true">Prev</span>
				</Rad.Components.Router.Link>
			</li>
		);
	}

	renderNextPageLink() {

		var params = {page: this.props.data.currentPage + 1};
		var disabled = this.props.data.currentPage == this.props.data.totalPages;

		if (this.props.urlParams) {
			var route = Rad.Router.getActiveRoute().name;
			return (
				<li className={disabled ? 'disabled' : ''}>
					<Rad.Components.Router.Link route={route} params={params} disabled={disabled}>
						<span aria-hidden="true">Next</span>
					</Rad.Components.Router.Link>
				</li>
			);
		}

		return (
			<li className={disabled ? 'disabled' : ''}>
				<Rad.Components.Router.Link onClick={disabled ? _.noop : this.props.onChangePage.bind(this, params)}>
					<span aria-hidden="true">Next</span>
				</Rad.Components.Router.Link>
			</li>
		);

	}

	onChangePerPage(page) {
		this.setState(page);
		this.props.onChangePerPage(page);
	}

	renderPerPageOptions() {
		if (this.props.perPageOptions === false) {
			return null;
		}


		return (
			<Rad.Components.Form.Select2 valueLink={this.linkState('perPage')}>
				{this.props.perPageOptions.split(',').map(page => {
					return <option value={page} key={'pagination-perPage-' + page}>{page}</option>;
				})}
			</Rad.Components.Form.Select2>
		);

	}

	render() {
		var [Grid, Form] = this.inject('Grid,Form');
		if (this.props.data.totalCount == 0) {
			return null;
		}

		var data = this.props.data;

		var pages = [];

		_.range(1, data.totalPages + 1).forEach(page => {
			pages.push(this.renderPage(page));
		});

		return (
			<div className={this.props.className}>
				<span>Showing {this.renderPerPageOptions()} results per page</span>
				<nav>
					<ul className="pagination">
						{this.renderPreviousPageLink()}
						{pages}
						{this.renderNextPageLink()}
					</ul>
				</nav>
			</div>
		);
	}
}

Pagination.defaultProps = {
	perPageOptions: '10,25,50',
	perPageInitial: 10,
	onChangePerPage: _.noop,
	onChangePage: _.noop
};

export default Pagination;