import Webiny from 'Webiny';
import SimpleSelect from './SimpleSelect';

class Select extends Webiny.Ui.OptionComponent {

    constructor(props) {
        super(props);
        this.bindMethods('getCurrentData,getPreviousData,renderSelect');
    }

    getCurrentData() {
        return this.refs.input.getCurrentData();
    }

    getPreviousData() {
        return this.refs.input.getPreviousData();
    }

    renderSelect() {
        const props = _.pick(this.props, _.keys(_.omit(SimpleSelect.defaultProps, ['renderer'])));
        _.assign(props, {
            ref: 'input',
            options: this.state.options,
            disabled: this.isDisabled(),
            placeholder: this.getPlaceholder(),
            onChange: newValue => {
                this.props.onChange(newValue, !this.isValid() ? this.validate : _.noop);
            }
        });

        return <SimpleSelect {...props}/>;
    }
}

Select.defaultProps = _.merge({}, Webiny.Ui.OptionComponent.defaultProps, {
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        return (
            <div className={this.classSet(cssConfig)} style={this.props.style}>
                {this.renderLabel()}
                {this.renderSelect()}
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Select;