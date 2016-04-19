import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ViewSwitcherContainer extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            view: '',
            modalView: '',
            params: [],
            modalParams: []
        };

        this.views = {};
        this.defaultView = null;

        this.bindMethods('showView');
    }

    showView(name) {
        return (...params) => {
            if (this.views[name].props.modal) {
                this.setState({modalView: name, modalParams: params});
            } else {
                this.setState({view: name, params});
            }
        };
    }

    componentWillMount() {
        super.componentWillMount();

        React.Children.map(this.props.children, child => {
            if (child.type === Ui.ViewSwitcher.View) {
                this.views[child.props.view] = child;
                if (child.props.defaultView) {
                    this.setState({view: child.props.view});
                }
            }
        });
    }
}

ViewSwitcherContainer.defaultProps = {
    renderer() {
        const content = [];
        if (this.state.view !== '') {
            content.push(React.cloneElement(this.views[this.state.view], {
                key: this.state.view,
                container: this,
                params: this.state.params
            }));
        }

        if (this.state.modalView !== '') {
            content.push(React.cloneElement(this.views[this.state.modalView], {
                key: this.state.modalView,
                container: this,
                params: this.state.modalParams
            }));
        }

        return (
            <webiny-view-switcher>{content}</webiny-view-switcher>
        );
    }
};

export default ViewSwitcherContainer;
