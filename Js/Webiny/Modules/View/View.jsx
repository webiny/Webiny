import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class View extends Webiny.Ui.Component {
    parseLayout(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }

        React.Children.map(children, child => {
            if (child.type === Ui.View.Header) {
                this.headerTemplate = child;
            }

            if (child.type === Ui.View.Body) {
                this.bodyTemplate = child;
            }

            if (child.type === Ui.View.Footer) {
                this.footerTemplate = child;
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

View.defaultProps = {
    renderer() {
        return (
            <view>
                {this.headerTemplate}
                <div className="view-content">
                    <Ui.Panel.Panel>
                        {this.bodyTemplate}
                        {this.footerTemplate}
                    </Ui.Panel.Panel>
                </div>
            </view>
        );
    }
};

export default View;