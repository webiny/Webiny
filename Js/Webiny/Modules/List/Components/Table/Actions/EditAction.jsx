import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EditAction extends Webiny.Ui.Component {

}

EditAction.defaultProps = {
    label: 'Edit',
    renderer: function renderer() {
        let route = this.props.route;
        if(_.isFunction(route)){
            route = route(this.props.data);
        }

        return (
            <Ui.List.Table.RouteAction data={this.props.data} label={this.props.label} route={route}/>
        );
    }
};

export default EditAction;