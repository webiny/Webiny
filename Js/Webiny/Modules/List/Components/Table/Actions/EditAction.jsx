import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EditAction extends Webiny.Ui.Component {

}

EditAction.defaultProps = {
    label: 'Edit',
    icon: 'icon-pencil',
    renderer() {
        const props = _.pick(this.props, ['data', 'label', 'icon']);

        if (this.props.onClick) {
            const icon = props.icon ? <Ui.Icon icon={props.icon}/> : null;
            props.onClick = () => this.props.onClick(this.props.data);
            return <Ui.Link {...props}>{icon} {props.label}</Ui.Link>;
        }

        if (this.props.route) {
            let route = this.props.route;
            if (_.isFunction(route)) {
                route = route(this.props.data);
            }
            props.route = route;
        }

        return (
            <Ui.List.Table.RouteAction {...props}/>
        );
    }
};

export default EditAction;