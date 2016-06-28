import View from './../Core/View';
import Router from './../Router/Router';
import Dispatcher from './../Core/Dispatcher';
import UiDispatcher from './../Core/UiDispatcher';
import Placeholder from './Placeholder';

class RootElement extends View {

    constructor() {
        super();

        this.state = {
            loading: true
        };

        this.bindMethods('onDidUpdate,checkHash');
    }

    componentDidMount() {
        this.unsubscribe = Dispatcher.on('RenderRoute', () => {
            return this.setState({
                time: new Date().getTime()
            });
        });

        Router.start(window.location.pathname).then(() => {
            this.setState({loading: false});
            this.checkHash();
        });
    }

    checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#ui:')) {
            const ui = _.trimStart(hash, '#ui:');
            UiDispatcher.createSignal(this, ui)();
        }
    }

    onDidUpdate() {
        window.scrollTo(0, 0);
        // Since this is a top level component, it will dispatch RouteChanged event after everything has finished rendering
        Dispatcher.dispatch('RouteChanged', Router.getActiveRoute());
        this.checkHash();
    }

    render() {
        if (!this.state.loading) {
            return <Placeholder onDidUpdate={this.onDidUpdate} name="MasterLayout"/>;
        }
        return null;
    }
}

export default RootElement;
