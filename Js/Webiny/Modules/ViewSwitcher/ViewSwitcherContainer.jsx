import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ViewSwitcherContainer extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.views = {};
        this.defaultView = null;
        this.viewProps = {
            container: this,
            attachView: view => {
                this.views[view.props.view] = view;
            },
            detachView: view => {
                delete this.views[view.props.view];
            }
        };

        this.bindMethods('showView,renderView');
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.defaultView) {
            this.views[this.defaultView].show();
        }
    }

    showView(name) {
        return (...params) => {
            if (params.length && _.isFunction(params[0].persist)) {
                params = [];
            }

            const view = this.views[name];
            if (!view) {
                console.warn("Warning: view '" + name + "' was not found in ViewContainer!");
                return;
            }

            if (view.props.modal) {
                view.show(params);
            } else {
                // TODO: hide current view
                view.show(params);
            }
        };
    }

    renderView(view) {
        if (view.type === Ui.ViewSwitcher.View) {
            if (view.props.defaultView) {
                this.defaultView = view.props.view;
            }
            return React.cloneElement(view, _.assign({}, this.viewProps, {key: view.props.view}));
        }
        return null;
    }
}

ViewSwitcherContainer.defaultProps = {
    renderer() {
        return (
            <webiny-view-switcher>{React.Children.map(this.props.children, this.renderView)}</webiny-view-switcher>
        );
    }
};

export default ViewSwitcherContainer;
