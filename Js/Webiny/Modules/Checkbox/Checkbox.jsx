import Webiny from 'Webiny';

class Checkbox extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.bindMethods('onChange', 'childChanged');
    }

    componentWillMount() {
        super.componentWillMount();
        this.id = Webiny.Tools.createUID();
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
            this.props.onChange(this.props.stateKey, e.target.checked);
        }
    }
}

Checkbox.defaultProps = {
    disabled: false,
    label: '',
    grid: 3,
    className: '',
    renderer: function renderer() {
        const id = this.id;
        const value = _.get(this.props, 'valueLink.value') || this.props.state;

        const disabled = this.props.disabled ? 'checkbox-disabled' : false;
        const css = this.classSet('checkbox-custom checkbox-default', disabled, this.props.className, 'col-sm-' + this.props.grid);
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

        children = <label htmlFor={id}>{this.props.label} {children}</label>;

        const checkboxProps = {
            id,
            disabled: this.isDisabled(),
            type: 'checkbox',
            onChange: this.onChange,
            checked: !_.isNull(value) && value !== false && value !== undefined
        };

        return (
            <div className={css}>
                <input {...checkboxProps}/>
                {children}
                {this.props.addon || null}
            </div>
        );
    }
};

export default Checkbox;