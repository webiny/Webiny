import Webiny from 'Webiny';

class View extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            params: []
        };

        this.bindMethods('show');
    }

    componentWillMount() {
        super.componentWillMount();

        if (this.props.attachView) {
            this.props.attachView(this);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.detachView) {
            this.props.detachView(this);
        }
    }

    isShown() {
        return this.state.show;
    }

    show(params = []) {
        return new Promise(resolve => {
            this.showResolve = resolve;
            this.setState({show: true, params});
        });
    }

    hide() {
        if (this.props.modal && this.state.show) {
            return this.refs.view.hide();
        }

        if (this.state.show) {
            this.setState({show: false, params: []});
        }

        return Promise.resolve(true);
    }
}

View.defaultProps = {
    defaultView: false,
    modal: false,
    renderer() {
        if (this.state.show) {
            const view = this.props.children(this.props.container.showView, ...this.state.params);
            const props = {ref: 'view'};
            if (this.props.modal) {
                // onComponentDidMount is a special callback that will be executed once the actual component is mounted
                // We need access to the actual mounted instance of component and not the proxy ComponentWrapper
                props.onComponentDidMount = (instance) => {
                    instance.show().then(this.showResolve || _.noop);
                };
                props.onHidden = () => {
                    this.setState({show: false, params: []});
                };
            }
            return React.cloneElement(view, props);
        }
        return null;
    }
};

export default Webiny.createComponent(View);
