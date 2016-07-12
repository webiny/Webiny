import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SelectRow extends Webiny.Ui.Component {

}

SelectRow.defaultProps = {
    renderer() {
        return (
            <td className="select-row">
                <Ui.Checkbox state={this.props.value} onChange={this.props.onChange} className="checkbox--select-row"/>
            </td>
        );
    }
};

export default SelectRow;