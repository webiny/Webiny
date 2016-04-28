import Webiny from 'Webiny';

class RowDetails extends Webiny.Ui.Component {

}

RowDetails.defaultProps = {
    fieldsCount: 0,
    className: null,
    renderer() {
        return (
            <tr className={this.classSet(this.props.className)} style={{display: this.props.expanded ? 'table-row' : 'none'}}>
                <td colSpan={this.props.fieldsCount}>
                    {this.props.children(this.props.data, this)}
                </td>
            </tr>
        );
    }
};

export default RowDetails;