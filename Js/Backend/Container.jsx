import Webiny from 'Webiny';

class Container extends Webiny.Ui.View {

    constructor() {
        super();

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        Webiny.Router.start(window.location.pathname).then(() => {
            this.setState({loading: false});
        }, (e) => {
            console.error(e);
        });
    }

    componentDidMount() {
        this.unsubscribe = Webiny.Dispatcher.on('RenderRoute', () => {
            return this.setState({
                time: new Date().getTime()
            });
        });
    }

    onDidUpdate() {
        window.scrollTo(0, 0);
        // Since this is a top level component, it will dispatch RouteChanged event after everything has finished rendering
        Webiny.Dispatcher.dispatch('RouteChanged', Webiny.Router.getActiveRoute());
    }

    render() {
        if (!this.state.loading) {
            return <Webiny.Ui.Placeholder onDidUpdate={this.onDidUpdate} name="MasterLayout"/>;
        }
        return null;
    }
}

export default Container;
