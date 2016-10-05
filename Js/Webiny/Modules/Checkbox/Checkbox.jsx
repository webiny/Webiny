import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Checkbox extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('checkbox-');
        this.bindMethods('onChange,isChecked');
    }

    onChange(e) {
        if (this.props.optionIndex !== null) {
            this.props.onChange(this.props.optionIndex, e.target.checked);
        } else {
            const callback = this.props.validate ? this.validate : _.noop;
            this.props.onChange(e.target.checked, callback);
        }
    }

    isChecked() {
        const value = this.props.value || this.props.state;
        return !_.isNull(value) && value !== false && value !== undefined;
    }
}

Checkbox.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    label: '',
    grid: 3,
    className: null,
    optionIndex: null,
    labelRenderer(){
        let tooltip = null;
        if (this.props.tooltip) {
            tooltip = <Ui.Tooltip key="label" target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
        }
        return <span>{this.props.label} {tooltip}</span>
    },
    renderer() {
        const css = this.classSet(
            'checkbox-custom checkbox-default',
            {'checkbox-disabled': this.isDisabled()},
            this.props.className,
            'col-sm-' + this.props.grid
        );

        const checkboxProps = {
            disabled: this.isDisabled(),
            onChange: this.onChange,
            checked: this.isChecked()
        };

        return (
            <div className={css}>
                <input id={this.id} type="checkbox" {...checkboxProps}/>
                <label htmlFor={this.id}>{this.renderLabel()}</label>
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Checkbox;