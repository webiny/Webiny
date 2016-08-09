import Webiny from 'Webiny';

class ViewSwitcherView extends Webiny.Ui.Component {

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

    componentDidUpdate() {
        super.componentDidUpdate();
        if (this.props.modal && this.state.show) {
            if (!_.isFunction(this.refs.view.show)) {
                console.warn('Warning: view "' + this.props.view + '" is marked as modal but has no "show" method!');
                if (_.isFunction(this.showResolve)) {
                    this.showResolve();
                }
                return true;
            }
            return this.refs.view.show().then(this.showResolve || _.noop);
        }

        if (_.isFunction(this.showResolve)) {
            this.showResolve();
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

        return Q(true);
    }
}

ViewSwitcherView.defaultProps = {
    defaultView: false,
    modal: false,
    renderer() {
        if (this.state.show) {
            const view = this.props.children(this.props.container.showView, ...this.state.params);
            const props = {ref: 'view'};
            if (this.props.modal) {
                props.onHidden = () => {
                    this.setState({show: false, params: []});
                };
            }
            return React.cloneElement(view, props);
        }
        return null;
    }
};

export default ViewSwitcherView;
