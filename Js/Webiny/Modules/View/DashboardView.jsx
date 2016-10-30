import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class DashboardView extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('parseLayout');
    }

    parseLayout(children) {
        this.headerComponent = null;
        this.bodyComponent = null;
        this.footerComponent = null;

        if (typeof children !== 'object' || children === null) {
            return children;
        }

        React.Children.map(children, child => {
            if (child.type === Ui.View.Header) {
                this.headerComponent = child;
                return;
            }

            if (child.type === Ui.View.Body) {
                this.bodyComponent = React.createElement('div', {className: ''}, child.props.children);
                return;
            }
        });
    }

    componentWillMount() {
        super.componentWillMount();
        this.parseLayout(this.props.children);
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        this.parseLayout(nextProps.children);
    }
}

DashboardView.defaultProps = {
    renderer() {
        return (
            <view>
                {this.headerComponent}
                <div className="dashboard-content">
                    {this.bodyComponent}
                </div>
            </view>
        );
    }
};

export default DashboardView;