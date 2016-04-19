import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class RouteAction extends Webiny.Ui.Component {

}

RouteAction.defaultProps = {
    params: null,
    renderer() {
        let params = !this.props.params ? Webiny.Router.getRoute(this.props.route).paramNames : _.clone(this.props.params);

        if (_.isString(params) || _.isArray(params)) {
            const paramNames = _.isString(params) ? params.split(',') : params;
            params = {};
            paramNames.map(p => {
                params[p] = this.props.data[p];
            });
        }

        return (
            <Ui.Link route={this.props.route} params={params}>{this.props.label}</Ui.Link>
        );
    }
};

export default RouteAction;