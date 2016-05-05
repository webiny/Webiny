import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SelectRow extends Webiny.Ui.Component {

}

SelectRow.defaultProps = {
    renderer() {
        return (
            <td className="small-col">
                <Ui.Checkbox state={this.props.value} onChange={this.props.onChange} className="checkbox--no-desc"/>
            </td>
        );
    }
};

export default SelectRow;