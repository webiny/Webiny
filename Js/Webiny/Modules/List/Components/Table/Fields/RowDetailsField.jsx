import Webiny from 'Webiny';
import Field from './../Field';

class RowDetailsField extends Field {

}

RowDetailsField.defaultProps = _.merge({}, Field.defaultProps, {
    hide: false,
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

        let content = <Webiny.Ui.Components.Link {...props}/>;
        if (_.isFunction(this.props.hide) ? this.props.hide(this.props.data) : this.props.hide) {
            content = null;
        }
        
        return (
            <td className={this.getTdClasses('row-details')}>
                {content}
            </td>
        );
    }
});

export default RowDetailsField;