import Webiny from 'Webiny';
import Field from './../Field';

class RowDetailsField extends Field {

}

RowDetailsField.defaultProps = _.merge({}, Field.defaultProps, {
    hide: () => false,
    renderer() {
        let onClick = this.props.actions.hideRowDetails;
        let className = 'expand close';
        if (!this.props.rowDetailsExpanded) {
            onClick = this.props.actions.showRowDetails;
            className = 'expand';
        }

        const props = {
            onClick: onClick(this.props.rowIndex),
            className
        };

        return (
            <td className={this.getTdClasses()}>
                {this.props.hide(this.props.data) ? null : <Webiny.Ui.Components.Link {...props}/>}
            </td>
        );
    }
});

export default RowDetailsField;