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
            value: ''
        };

        this.bindMethods('changed');
    }

    changed() {
        clearTimeout(this.delay);
        this.delay = setTimeout(() => {
            this.realValueLink.requestChange(this.state.value);
        }, this.props.delay);
    }

    render() {
        this.realValueLink = this.props.children.props.valueLink;
        const props = _.omit(this.props.children.props, ['valueLink']);
        props.valueLink = this.bindTo('value', this.changed);

        return React.cloneElement(this.props.children, props);
    }
}

DelayedValueLink.defaultProps = {
    delay: 200
};

export default DelayedValueLink;