import Webiny from 'Webiny';
import SimpleSelect from './SimpleSelect';

class Select extends Webiny.Ui.OptionComponent {

    constructor(props) {
        super(props);
        this.bindMethods('getCurrentData,getPreviousData');
    }

    getCurrentData() {
        return this.refs.input.getCurrentData();
    }

    getPreviousData() {
        return this.refs.input.getPreviousData();
    }
}

Select.defaultProps = _.merge({}, Webiny.Ui.OptionComponent.defaultProps, {
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const selectProps = [
            'value',
            'onChange',
            'allowClear',
            'placeholder',
            'minimumInputLength',
            'minimumResultsForSearch',
            'useDataAsValue',
            'dropdownParent',
            'dropdownClassName',
            'optionRenderer',
            'selectedRenderer'
        ];

        const props = _.pick(this.props, selectProps);
        _.assign(props, {
            options: this.state.options,
            disabled: this.isDisabled(),
            onChange: newValue => {
                this.props.onChange(newValue, !this.isValid() ? this.validate : _.noop)
            }
        });

        return (
            <div className={this.classSet(cssConfig)}>
                {this.renderLabel()}
                <SimpleSelect ref="input" {...props}/>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Select;