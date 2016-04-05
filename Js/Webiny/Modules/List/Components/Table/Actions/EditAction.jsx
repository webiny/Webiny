import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class EditAction extends Webiny.Ui.Component {

}

EditAction.defaultProps = {
    label: 'Edit',
    renderer: function renderer() {
        return (
            <Ui.List.Table.RouteAction data={this.props.data} label={this.props.label} route={this.props.route}/>
        );
    }
};

export default EditAction;