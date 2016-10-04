import Webiny from 'Webiny';
import Radio from './Radio';

class RadioGroup extends Webiny.Ui.OptionComponent {
    constructor(props) {
        super(props);

        this.bindMethods('renderOptions');
    }

    /**
     * Render options elements
     * @returns {Array}
     */
    renderOptions() {
        return this.state.options.map((item, key) => {
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
                onChange: newValue => this.props.onChange(newValue, this.validate)
            };

            if (this.props.radioRenderer) {
                props.renderer = this.props.radioRenderer;
            }

            return <Radio {...props}/>;
        });
    }
}

RadioGroup.defaultProps = _.merge({}, Webiny.Ui.OptionComponent.defaultProps, {
    radioRenderer: null,
    disabledClass: 'disabled',
    renderer() {
        const classes = {'form-group': true};
        if (this.isDisabled()) {
            classes[this.props.disabledClass] = true;
        }

        return (
            <div className={this.classSet(classes)}>
                {this.renderLabel()}
                <div className="clearfix"></div>
                {this.renderOptions()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default RadioGroup;