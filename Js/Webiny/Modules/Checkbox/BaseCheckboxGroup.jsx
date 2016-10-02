import Webiny from 'Webiny';
import Checkbox from './Checkbox';

class BaseCheckboxGroup extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.bindMethods('onChange');
    }

    onChange(key, newValue) {
        const option = this.props.options[key];
        const newState = this.props.value || [];
        if (newValue) {
            newValue = this.props.formatValue(option);
            newState.push(newValue);
        } else {
            const currentIndex = _.findIndex(newState, opt => {
                const optValue = this.props.valueKey ? _.get(opt, this.props.valueKey) : opt;
                return optValue === option.id;
            });

            newState.splice(currentIndex, 1);
        }
        this.props.onChange(newState, this.validate);
    }

    /**
     * Create options elements
     * @returns {Array}
     */
    getOptions() {
        const items = [];
        _.forEach(this.props.options, (item, key) => {
            const checked = _.find(this.props.value, opt => {
                if (_.isPlainObject(opt)) {
                    return _.get(opt, this.props.valueKey) === item.id;
                }
                return opt === item.id;
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
    valueKey: null,
    valueAttr: 'id',
    textAttr: 'name',
    checkboxRenderer: null,
    formatValue: value => value.id
};

export default BaseCheckboxGroup;