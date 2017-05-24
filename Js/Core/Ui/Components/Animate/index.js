import Webiny from 'Webiny';
import AnimationSets from './AnimationSets';
import ReactTransitionGroup from 'react-addons-transition-group';

/**
 * Only componentWillEnter and componentWillLeave can be used because they way Dialog component mounts into DOM.
 */
class Container extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {shown: false};
        this.bindMethods('hideAction', 'showAction');
    }

    componentDidMount() {
        //this.animationContainer = ReactDOM.findDOMNode(this);
    }

    /*
    componentWillAppear(callback) {
        callback();
        console.log('will appear');
        //this.showAction(callback);

    }

    componentDidAppear() {
        console.log('componentDidAppear');
    }
    */

    componentWillEnter(callback) {
        this.showAction(callback);
    }
    
    /*
    componentDidEnter() {
        console.log('did enter');
    }

    componentWillUnmount(callback) {
        callback();
        console.log('wiil unmount');
        //this.hideAction(callback);
    }
    */

    componentWillLeave(callback) {
        this.hideAction(callback);
    }

    hideAction(callback) {
        if (!this.state.shown) {
            //callback();
            return;
        }
        this.setState({shown: false});

        const elements = ReactDOM.findDOMNode(this).childNodes;

        const hideCallback = () => {
            try {
                callback();
            } catch (e) {
                // ignore
            }

            if (_.isFunction(this.props.onFinish)) {
                this.props.onFinish();
            }
        };

        _.forEach(elements, (el) => {
            if (_.isObject(this.props.hide)) {
                AnimationSets.custom(this.props.hide, el, hideCallback);
            } else {
                AnimationSets[this.props.hide](el, hideCallback);
            }
        });
    }

    showAction(callback) {
        if (this.state.shown) {
            //callback();
            return;
        }
        this.setState({shown: true});

        const elements = ReactDOM.findDOMNode(this).childNodes;

        const showCallback = () => {
            callback();
            if (_.isFunction(this.props.onFinish)) {
                this.props.onFinish(true);
            }
        };

        _.forEach(elements, (el) => {
            if (_.isObject(this.props.show)) {
                AnimationSets.custom(this.props.show, el, () => {
                    try {
                        callback();
                    } catch (e) {
                        // ignore
                    }
                    if (_.isFunction(this.props.onFinish)) {
                        this.props.onFinish(true);
                    }
                });
            } else {
                AnimationSets[this.props.show](el, showCallback);
            }
        });
    }
}

Container.defaultProps = {
    renderer() {
        return <div className={this.props.className}>{this.props.children}</div>;
    }
};

class Animate extends Webiny.Ui.Component {

    firstChild(props) {
        const childrenArray = React.Children.toArray(props.children);
        return childrenArray[0] || null;
    }
}

Animate.defaultProps = {
    trigger: false,
    onFinish: _.noop,
    show: 'fadeIn',
    hide: 'fadeOut',
    renderer() {
        return (
            <ReactTransitionGroup component={this.firstChild}>
                {(this.props.trigger === true) && (
                    <Container
                        onFinish={this.props.onFinish}
                        show={this.props.show}
                        hide={this.props.hide}
                        className={this.props.className}>
                        {this.props.children}
                    </Container>
                )}
            </ReactTransitionGroup>
        );
    }
};


export default Animate;