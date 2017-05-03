import Webiny from 'Webiny';

class RowDetailsField extends Webiny.Ui.Component {

}

RowDetailsField.defaultProps = {
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

        const {Link, List, ...tdProps} = this.props;
        let content = <Link {...props}/>;
        if (_.isFunction(this.props.hide) ? this.props.hide(this.props.data) : this.props.hide) {
            content = null;
        }

        return (
            <List.Table.Field {..._.omit(tdProps, ['renderer'])} className="row-details">
                {() => content}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(RowDetailsField, {modules: ['Link', 'List'], tableField: true});