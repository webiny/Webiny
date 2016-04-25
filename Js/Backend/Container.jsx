import Webiny from 'Webiny';

class Container extends Webiny.Ui.View {

    constructor() {
        super();

        this.state = {
            loading: true
        };

        this.bindMethods('onDidUpdate,checkHash');
    }

    componentWillMount() {
        Webiny.Router.start(window.location.pathname).then(() => {
            this.setState({loading: false});
        });
    }

    componentDidMount() {
        this.unsubscribe = Webiny.Dispatcher.on('RenderRoute', () => {
            return this.setState({
                time: new Date().getTime()
            });
        });
        this.checkHash();
    }

    checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#ui:')) {
            const ui = _.trimStart(hash, '#ui:');
            Webiny.Ui.Dispatcher.createSignal(this, ui)();
        }
    }

    onDidUpdate() {
        window.scrollTo(0, 0);
        // Since this is a top level component, it will dispatch RouteChanged event after everything has finished rendering
        Webiny.Dispatcher.dispatch('RouteChanged', Webiny.Router.getActiveRoute());
        this.checkHash();
    }

    render() {
        if (!this.state.loading) {
            return <Webiny.Ui.Components.Placeholder onDidUpdate={this.onDidUpdate} name="MasterLayout"/>;
        }
        return null;
    }
}

export default Container;
