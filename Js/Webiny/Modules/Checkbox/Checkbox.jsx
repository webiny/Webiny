import Webiny from 'Webiny';

class Checkbox extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('checkbox-');
        this.bindMethods('onChange,isChecked');
    }

    onChange(e) {
        if (this.props.stateKey !== null) {
            this.props.onChange(this.props.stateKey, e.target.checked);
        } else {
            this.props.onChange(e.target.checked);
        }
    }

    isChecked() {
        const value = this.props.value || this.props.state;
        return !_.isNull(value) && value !== false && value !== undefined;
    }
}

Checkbox.defaultProps = {
    disabled: false,
    label: '',
    grid: 3,
    className: '',
    addon: null,
    stateKey: null,
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
                <label htmlFor={this.id}>{this.props.label} {this.props.children}</label>
                {this.props.addon || null}
            </div>
        );
    }
};

export default Checkbox;