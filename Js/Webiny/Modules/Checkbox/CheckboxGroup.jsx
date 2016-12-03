import Webiny from 'Webiny';
import Checkbox from './Checkbox';

class CheckboxGroup extends Webiny.Ui.OptionComponent {
    constructor(props) {
        super(props);

        this.bindMethods('renderOptions,onChange');
    }

    onChange(key, newValue) {
        const option = this.state.options[key];
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
    renderOptions(callback = null) {
        return this.state.options.map((item, key) => {
            const checked = _.find(this.props.value, opt => {
                if (_.isPlainObject(opt)) {
                    return _.get(opt, this.props.valueKey) === item.id;
                }
                return opt === item.id;
            });

            const props = {
                key, // React key
                grid: item.grid || this.props.grid,
                label: item.text,
                disabled: this.isDisabled(),
                state: checked, // true/false (checked/unchecked)
                onChange: this.onChange,
                option: item,
                optionIndex: key
            };

            if (_.isFunction(this.props.checkboxRenderer)) {
                props.renderer = this.props.checkboxRenderer;
            }

            if (_.isFunction(this.props.checkboxLabelRenderer)) {
                props.labelRenderer = this.props.checkboxLabelRenderer;
            }
            const checkbox = <Checkbox {...props}/>;

            if (callback) {
                return callback(checkbox, key);
            }

            return checkbox;
        });
    }
}

CheckboxGroup.defaultProps = _.merge({}, Webiny.Ui.OptionComponent.defaultProps, {
    grid: 12,
    valueKey: null,
    valueAttr: 'id',
    textAttr: 'name',
    disabledClass: 'disabled',
    checkboxRenderer: null,
    checkboxLabelRenderer: null,
    formatValue: value => value.id,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        if (this.isDisabled()) {
            cssConfig[this.props.disabledClass] = true;
        }

        return (
            <div className={this.classSet(this.props.className)}>
                <div className={this.classSet(cssConfig)}>
                    {this.renderLabel()}
                    <div className="clearfix"></div>
                    {this.renderOptions()}
                </div>
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default CheckboxGroup;