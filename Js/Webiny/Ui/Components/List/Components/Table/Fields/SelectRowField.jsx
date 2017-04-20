import Webiny from 'Webiny';
import Field from './../Field';

class SelectRowField extends Field {

}

SelectRowField.defaultProps = _.merge({}, Field.defaultProps, {
    className: 'select-row',
    headerRenderer() {
        const {Checkbox} = this.props;
        return (
            <th className="select-row">
                <Checkbox state={this.props.allRowsSelected} onChange={this.props.onSelectAll} className="checkbox--select-row"/>
            </th>
        );
    },
    renderer() {
        const {rowSelected, rowDisabled, onSelect, Checkbox} = this.props;
        return (
            <td className={this.getTdClasses()}>
                <Checkbox disabled={rowDisabled} state={rowSelected} onChange={onSelect} className="checkbox--select-row"/>
            </td>
        );
    }
});

export default Webiny.createComponent(SelectRowField, {modules: ['Checkbox']});