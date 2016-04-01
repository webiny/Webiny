import Webiny from 'Webiny';
import Radio from './Radio';

class BaseRadioGroup extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        _.assign(this.state, {
            options: {}
        });
        this.bindMethods('registerOptions', 'onChange');
    }

    componentWillMount() {
        super.componentWillMount();
        this.registerOptions(this.props.items, this.props.children);
    }

    /**
     * Parse <checkbox> tags or use {items} object to build options
     * @param items
     * @param children
     */
    registerOptions(items = null, children = null) {
        const options = [];

        if (items) {
            _.each(items, (label, key) => {
                options.push({label, key});
            });
        } else {
            React.Children.map(children, (child) => {
                var value = child.props.value;

                options.push({
                    label: child.props.children,
                    key: value
                });
            });
        }

        this.setState({options});
    }

    onChange(newValue) {
        if (newValue === "false") {
            newValue = false;
        } else if (newValue === "true") {
            newValue = true;
        }
        this.props.valueLink.requestChange(newValue, this.validate);
    }

    /**
     * Create options elements
     * @returns {Array}
     */
    getOptions() {
        const items = [];
        _.forEach(this.state.options, (item, key) => {
            const props = {
                key: key,
                grid: item.grid || this.props.grid,
                label: item.label,
                stateKey: item.key,
                disabled: this.props.disabled,
                state: this.props.valueLink.value,
                onChange: this.onChange
            };

            items.push(<Radio {...props}/>);
        });
        return items;
    }

    componentWillReceiveProps(nextProps) {
        this.registerOptions(nextProps.options, nextProps.children);
    }
}

BaseRadioGroup.defaultProps = {
    disabled: false,
    label: ''
};

export default BaseRadioGroup;