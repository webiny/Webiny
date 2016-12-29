import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SelectRow extends Webiny.Ui.Component {

}

SelectRow.defaultProps = {
    disabled: false,
    renderer() {
        const {value, onChange} = this.props;
        const disabled = _.isFunction(this.props.disabled) ? this.props.disabled(this.props.data) : this.props.disabled;
        return (
            <td className="select-row">
                <Ui.Checkbox disabled={disabled} state={value} onChange={onChange} className="checkbox--select-row"/>
            </td>
        );
    }
};

export default SelectRow;