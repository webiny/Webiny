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
                return;
            }
            this.refs.view.show();
        }
    }

    isShown() {
        return this.state.show;
    }

    show(params = []) {
        this.setState({show: true, params});
    }

    hide() {
        this.setState({show: false, params: []});
    }
}

ViewSwitcherView.defaultProps = {
    defaultView: false,
    modal: false,
    renderer() {
        if (this.state.show) {
            const view = this.props.children(this.props.container.showView, ...this.state.params);
            return React.cloneElement(view, {ref: 'view'});
        }
        return null;
    }
};

export default ViewSwitcherView;
