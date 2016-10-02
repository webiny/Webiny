import Webiny from 'Webiny';
import Radio from './Radio';

class BaseRadioGroup extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        _.assign(this.state, {
            options: {}
        });
        this.bindMethods('onChange');
    }

    componentWillMount() {
        super.componentWillMount();
        const value = this.getValue();
        if ((value === undefined || value === null) && _.has(this.props, 'defaultValue')) {
            this.props.onChange(this.props.defaultValue);
        }
    }

    onChange(newValue) {
        this.props.onChange(newValue, this.validate);
    }

    /**
     * Create options elements
     * @returns {Array}
     */
    getOptions() {
        const items = [];
        _.forEach(this.props.options, (item, key) => {
            let checked = false;
            if (_.isPlainObject(this.props.value)) {
                checked = _.get(this.props.value, this.props.valueKey) === item.id;
            } else {
                checked = this.props.value === item.id;
            }

            const props = {
                key,
                grid: item.grid || this.props.grid,
                label: item.text,
                disabled: this.isDisabled(),
                value: item.id,
                checked,
                onChange: this.onChange
            };

            items.push(<Radio {...props}/>);
        });
        return items;
    }
}

BaseRadioGroup.defaultProps = {
    disabled: false,
    label: ''
};

export default BaseRadioGroup;