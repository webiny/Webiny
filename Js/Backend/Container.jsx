class Container extends Rad.View {

	constructor() {
		super();

		this.state = {
			loading: true
		};
	}

	componentWillMount() {
		Rad.Router.start(window.location.pathname).then(routerEvent => {
			this.setState({loading: false});
		}, (e) => {
			console.error(e);
		});
	}

	componentDidMount() {
		this.unsubscribe = Rad.EventManager.listen('RenderRoute', (route) => {
			return this.setState({
				time: new Date().getTime()
			});
		});
	}

	onDidUpdate() {
		window.scrollTo(0, 0);
		// Since this is a top level component, it will emit RouteChanged event after everything has finished rendering
		Rad.EventManager.emit('RouteChanged', Rad.Router.getActiveRoute());
	}

	render() {

		var content = (
			<div className="preloader" style={{display: 'block'}}>
				<span className="loader">
					<span className="loader-inner"></span>
				</span>
				<i className="demo-icon icon-hkt-icon"></i>
			</div>
		);

		if (!this.state.loading) {
			return <Rad.Components.Router.Placeholder onDidUpdate={this.onDidUpdate} name="Layout"/>;
		}
		return content;
	}
}

export default Container;