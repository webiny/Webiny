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
        this.unsubscribe = Dispatcher.on('RenderView', () => {
            return this.setState({
                time: _.now()
            });
        });

        this.hideLoader();
        Router.start().then(() => {
            this.setState({loading: false});
            this.checkHash();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unsubscribe();
    }

    checkHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#ui:')) {
            const ui = _.trimStart(hash, '#ui:');
            UiDispatcher.createSignal(this, ui)();
        }
    }

    hideLoader() {
        const loader = document.querySelector('.preloader-wrap');
        if (loader) {
            setTimeout(() => {
                dynamics.animate(loader, {
                    opacity: 0
                }, {
                    type: dynamics.easeOut,
                    duration: 500,
                    complete: () => {
                        loader.style.display = 'none';
                    }
                });
            }, 200);
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
