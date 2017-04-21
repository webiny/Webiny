import Webiny from 'Webiny';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

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
            if (Webiny.isElementOfType(child, Header)) {
                this.headerComponent = child;
                return;
            }

            if (Webiny.isElementOfType(child, Body)) {
                this.bodyComponent = child;
                return;
            }

            if (Webiny.isElementOfType(child, Footer)) {
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
        const {Panel} = this.props;
        return (
            <view>
                {this.headerComponent}
                <div className="view-content">
                    <Panel className={'panel--boxed'}>
                        {this.bodyComponent}
                        {this.footerComponent}
                    </Panel>
                </div>
            </view>
        );
    }
};

export default Webiny.createComponent(View, {modules: ['Panel']});