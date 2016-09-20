import Webiny from 'Webiny';

class Checkbox extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('checkbox-');
        this.bindMethods('onChange,childChanged,isChecked');
    }

    /**
     * This method is used as an onChange callback for child CheckboxGroup elements
     *
     * @param key Key in parent state to update
     * @param newValue
     */
    childChanged(key, newValue) {
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(newValue);
        } else {
            this.props.onChange(key, newValue);
        }
    }

    onChange(e) {
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(e.target.checked);
        } else {
            if (this.props.stateKey) {
                this.props.onChange(this.props.stateKey, e.target.checked);
            } else {
                this.props.onChange(e.target.checked);
            }
        }
    }

    isChecked() {
        const value = _.get(this.props, 'valueLink.value') || this.props.state;
        return !_.isNull(value) && value !== false && value !== undefined;
    }
}

Checkbox.defaultProps = {
    disabled: false,
    label: '',
    grid: 3,
    className: '',
    addon: null,
    renderer() {
        const css = this.classSet(
            'checkbox-custom checkbox-default',
            {'checkbox-disabled': this.isDisabled()},
            this.props.className,
            'col-sm-' + this.props.grid
        );
        let children = null;

        if (this.props.children) {
            children = React.Children.map(this.props.children, (child, key) => {
                const newProps = {
                    key,
                    form: this.props.form || null,
                    onChange: this.childChanged,
                    stateKey: this.props.stateKey,
                    state: this.props.state,
                    disabled: this.isDisabled()
                };
                return React.cloneElement(child, newProps, child.props.children);
            });
        }

        const checkboxProps = {
            disabled: this.isDisabled(),
            onChange: this.onChange,
            checked: this.isChecked()
        };

        return (
            <div className={css}>
                <input id={this.id} type="checkbox" {...checkboxProps}/>
                <label htmlFor={this.id}>{this.props.label} {children}</label>
                {this.props.addon || null}
            </div>
        );
    }
};

export default Checkbox;