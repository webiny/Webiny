import Webiny from 'Webiny';
import AnimationSets from './AnimationSets';
const ReactTransitionGroup = React.addons.TransitionGroup;

class Container extends Webiny.Ui.Component {
    componentDidMount() {
        this.animationContainer = ReactDOM.findDOMNode(this);
    }

    componentWillEnter(callback) {
        const elements = ReactDOM.findDOMNode(this).childNodes;

        _.forEach(elements, (el) => {
            if (_.isObject(this.props.show)) {
                AnimationSets.custom(this.props.show, el, callback);
            } else {
                AnimationSets[this.props.show](el, callback);
            }
        });
    }

    componentWillLeave(callback) {
        const elements = ReactDOM.findDOMNode(this).childNodes;

        _.forEach(elements, (el) => {
            if (_.isObject(this.props.hide)) {
                AnimationSets.custom(this.props.hide, el, () => {
                    callback();
                    if (_.isFunction(this.props.onFinish)) {
                        this.props.onFinish();
                    }
                });
            } else {
                AnimationSets[this.props.hide](el, () => {
                    callback();
                    if (_.isFunction(this.props.onFinish)) {
                        this.props.onFinish();
                    }
                });
            }
        });
    }

    componentDidLeave() {
    }
}

Container.defaultProps = {
    renderer(){
        return (
            <div>{this.props.children}</div>
        );
    }
};

class Animate extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            trigger: false
        };
    }

    componentWillReceiveProps(props) {
        this.setState({trigger: props.trigger});
    }
}

Animate.defaultProps = {
    onFinish: _.noop,
    show: 'fadeIn',
    hide: 'fadeOut',
    renderer(){
        return (
            <ReactTransitionGroup>
                {this.state.trigger && (
                    <Container onFinish={this.props.onFinish} show={this.props.show}
                               hide={this.props.hide}>{this.props.children}</Container>
                )}
            </ReactTransitionGroup>
        );
    }
};


export default Animate;