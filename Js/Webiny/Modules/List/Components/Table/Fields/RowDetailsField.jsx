import Field from './../Field';

class RowDetailsField extends Field {

}

RowDetailsField.defaultProps = _.merge({}, Field.defaultProps, {
    renderer() {
        let onClick = this.props.actions.hideRowDetails;
        let label = 'Hide details';
        if (!this.props.rowDetailsExpanded) {
            onClick = this.props.actions.showRowDetails;
            label = 'Show details';
        }

        return (
            <td className={this.getTdClasses()}>
                <Webiny.Ui.Components.Link onClick={onClick(this.props.rowIndex)}>{label}</Webiny.Ui.Components.Link>
            </td>
        );
    }
});

export default RowDetailsField;