import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class View extends Webiny.Ui.Component {

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
            if (Webiny.isElementOfType(child, Ui.View.Header)) {
                this.headerComponent = child;
                return;
            }

            if (Webiny.isElementOfType(child, Ui.View.Body)) {
                this.bodyComponent = child;
                return;
            }

            if (Webiny.isElementOfType(child, Ui.View.Footer)) {
                this.footerComponent = child;
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
                {this.headerComponent}
                <div className="view-content">
                    <Ui.Panel className={'panel--boxed'}>
                        {this.bodyComponent}
                        {this.footerComponent}
                    </Ui.Panel>
                </div>
            </view>
        );
    }
};

export default View;