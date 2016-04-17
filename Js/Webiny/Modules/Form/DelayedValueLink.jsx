import Webiny from 'Webiny';

/**
 * This component is used to wrap Input and Textarea components to optimize form re-render.
 * These 2 are the only components that trigger form model change on each character input.
 * This means, whenever you type a letter an entire form re-renders.
 * On complex forms you will feel and see a significant delay if this component is not used.
 *
 * The logic behind this component is to serve as a middleman between Form and Input/Textarea, and only notify form of a change when
 * a user stops typing for given period of time (200ms by default).
 */
class DelayedValueLink extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.delay = null;
        this.state = {
            value: props.children.props.valueLink.value
        };

        this.bindMethods('applyValue,changed');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!this.delay) {
            this.setState({value: props.children.props.valueLink.value});
        }
    }

    applyValue(value, callback = _.noop) {
        clearTimeout(this.delay);
        this.realValueLink.requestChange(value, callback);
    }

    changed() {
        clearTimeout(this.delay);
        this.delay = setTimeout(() => this.applyValue(this.state.value), this.props.delay);
    }

    render() {
        this.realValueLink = this.props.children.props.valueLink;
        const props = _.omit(this.props.children.props, ['valueLink']);
        props.valueLink = this.bindTo('value', this.changed);
        const realOnKeyDown = props.onKeyDown || _.noop;
        const realOnBlur = props.onBlur || _.noop;

        // Need to apply value if input lost focus
        props.onBlur = (e) => {
            e.persist();
            this.applyValue(e.target.value, () => realOnBlur(e));
        };

        // Need to listen for TAB key to apply new value immediately, without delay. Otherwise validation will be triggered with old value.
        props.onKeyDown = (e) => {
            e.persist();
            if (e.key === 'Tab') {
                this.applyValue(e.target.value, () => realOnKeyDown(e));
            } else {
                realOnKeyDown(e);
            }
        };

        return React.cloneElement(this.props.children, props);
    }
}

DelayedValueLink.defaultProps = {
    delay: 400
};

export default DelayedValueLink;