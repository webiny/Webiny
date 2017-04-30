import Webiny from 'Webiny';
import styles from './styles.css';

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
    style: null,
    optionIndex: null,
    labelRenderer() {
        let tooltip = null;
        if (this.props.tooltip) {
            tooltip = (
                <Webiny.Ui.LazyLoad modules={['Tooltip', 'Icon']}>
                    {(Ui) => (
                        <Ui.Tooltip key="label" target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>
                    )}
                </Webiny.Ui.LazyLoad>
            );
        }
        return <span>{this.props.label} {tooltip}</span>;
    },
    renderer() {
        const {styles} = this.props;
        const css = this.classSet(
            styles.checkbox,
            this.isDisabled() && styles.checkboxDisabled,
            this.props.className,
            this.props.grid ? 'col-sm-' + this.props.grid : null
        );

        const checkboxProps = {
            disabled: this.isDisabled(),
            onChange: this.onChange,
            checked: this.isChecked()
        };

        return (
            <div className={css} style={this.props.style}>
                <input id={this.id} type="checkbox" {...checkboxProps}/>
                <label htmlFor={this.id}>{this.renderLabel()}</label>
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Webiny.createComponent(Checkbox, {styles});