import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Field from './../Field';

class SelectRowField extends Field {

}

SelectRowField.defaultProps = _.merge({}, Field.defaultProps, {
    className: 'select-row',
    headerRenderer() {
        return (
            <th className="select-row">
                <Ui.Checkbox state={this.props.allRowsSelected} onChange={this.props.onSelectAll} className="checkbox--select-row"/>
            </th>
        );
    },
    renderer() {
        const {rowSelected, rowDisabled, onSelect} = this.props;
        return (
            <td className={this.getTdClasses()}>
                <Ui.Checkbox disabled={rowDisabled} state={rowSelected} onChange={onSelect} className="checkbox--select-row"/>
            </td>
        );
    }
});

export default SelectRowField;