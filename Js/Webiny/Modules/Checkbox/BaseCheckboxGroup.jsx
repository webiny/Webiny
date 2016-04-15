import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Checkbox from './Checkbox';

class BaseCheckboxGroup extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.checkboxChildren = [];
        _.assign(this.state, {
            data: {},
            options: []
        });

        this.bindMethods('registerOptions', 'prepareComponent', 'onChange');
    }

    componentWillMount() {
        super.componentWillMount();
        this.prepareComponent(this.props);
    }

    onChange(key, newValue) {
        // This flag tells us whether this was called from nested checkbox group
        const isComplex = _.isArray(newValue) || _.isPlainObject(newValue);

        // If empty array or empty object - convert it to boolean
        if (isComplex && Webiny.Tools.keys(newValue).length === 0) {
            newValue = true;
        }

        let partialState = this.state.data;

        if (!newValue) {
            delete partialState[key];
        } else {
            if (_.isBoolean(partialState)) {
                partialState = {};
            }
            partialState[key] = newValue;
        }

        // Set internal checkbox group state
        this.setState({data: partialState});

        // If this group does not have nested groups, we need to convert the model representation to array
        if (!this.checkboxChildren.length) {
            partialState = Object.keys(partialState);
        }

        // Notify main form of a new checkbox group state
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(partialState, this.validate);
        } else {
            this.props.onChange(this.props.stateKey, partialState);
        }
    }

    /**
     * Create options elements and handle nested checkbox groups if they exist
     * @returns {Array}
     */
    getOptions() {
        const items = [];
        _.forEach(this.state.options, (item, key) => {
            let children = null;
            if (this.checkboxChildren.length) {
                children = this.checkboxChildren;
            }

            const props = {
                form: this.props.form || null,
                key,
                stateKey: item.key,
                grid: item.grid || this.props.grid,
                label: item.label,
                children,
                disabled: this.props.disabled,
                state: this.state.data[item.key],
                onChange: this.onChange
            };

            items.push(<Checkbox {...props}/>);
        });
        return items;
    }

    /**
     * Parse <checkbox> tags or use {items} object to build checkboxes
     * @param items
     * @param children
     */
    registerOptions(items = null, children = null) {
        const checkboxes = [];

        if (items) {
            _.each(items, (label, key) => {
                checkboxes.push({
                    key,
                    label,
                    bind: 'data.' + key
                });
            });
        }

        React.Children.map(children, (child) => {
            if (child.type === 'checkbox' && !items) {
                const key = child.props.value;

                checkboxes.push({
                    key,
                    label: child.props.children,
                    bind: 'data.' + key
                });
            }

            if (child.type === Ui.CheckboxGroup && !this.checkboxChildren.length) {
                this.checkboxChildren.push(child);
            }
        });

        this.setState({options: checkboxes});
    }

    /**
     * When we receive new props, we need to convert array into an object for easier checkbox handling
     * and use that as local state.
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.prepareComponent(nextProps);
    }

    /**
     * Format data for single or nested checkbox groups
     * @param nextProps
     */
    prepareComponent(nextProps) {
        const value = _.get(nextProps, 'valueLink.value') || nextProps.state;
        let data = {};
        if (value) {
            if (_.isArray(value)) {
                Webiny.Tools.keys(value).forEach(key => {
                    data[value[key]] = true;
                });
            } else {
                data = value;
            }
        }
        this.setState({data});
        this.registerOptions(nextProps.options, nextProps.children);
    }
}

BaseCheckboxGroup.defaultProps = {
    disabled: false,
    label: '',
    grid: 12
};

export default BaseCheckboxGroup;