import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Checkbox from './Checkbox';

class BaseCheckboxGroup extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.bindMethods('onChange');
    }

    onChange(key, newValue) {
        const value = this.props.options[key];
        const newState = this.props.valueLink.value || [];
        if (newValue) {
            newValue = this.props.formatValue(value);
            newState.push(newValue);
        } else {
            const currentIndex = _.findIndex(newState, opt => {
                return _.get(opt, this.props.valueKey) == value.id;
            });

            newState.splice(currentIndex, 1);
        }

        // Notify main form of a new checkbox group state
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(newState, this.validate);
        } else {
            this.props.onChange(this.props.stateKey, newState);
        }
    }

    /**
     * Create options elements
     * @returns {Array}
     */
    getOptions() {
        const items = [];
        _.forEach(this.props.options, (item, key) => {
            const checked = _.find(this.props.valueLink.value, opt => {
                if (_.isPlainObject(opt)) {
                    return _.get(opt, this.props.valueKey) == item.id;
                }
                return opt == item.id;
            });
            const props = {
                form: this.props.form || null,
                key, // React key
                grid: item.grid || this.props.grid,
                label: item.text,
                disabled: this.isDisabled(),
                stateKey: key,
                state: checked, // true/false (checked/unchecked)
                onChange: this.onChange
            };

            if (this.props.checkboxRenderer) {
                props.renderer = this.props.checkboxRenderer;
            }

            items.push(<Checkbox {...props}/>);
        });
        return items;
    }
}

BaseCheckboxGroup.defaultProps = {
    disabled: false,
    label: '',
    grid: 12,
    valueKey: 'id',
    valueAttr: 'id',
    textAttr: 'name',
    checkboxRenderer: null,
    formatValue: value => value.id
};

export default BaseCheckboxGroup;