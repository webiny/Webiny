import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class RouteAction extends Webiny.Ui.Component {

}

RouteAction.defaultProps = {
    params: null,
    renderer() {
        const route = _.isFunction(this.props.route) ? this.props.route(this.props.data) : this.props.route;

        let params = !this.props.params ? Webiny.Router.getRoute(route).paramNames : _.clone(this.props.params);

        if (_.isString(params) || _.isArray(params)) {
            const paramNames = _.isString(params) ? params.split(',') : params;
            params = {};
            paramNames.map(p => {
                params[p] = this.props.data[p];
            });
        }

        if(_.isFunction(params)){
            params = params(this.props.data);
        }

        return (
            <Ui.Link route={route} params={params}>{this.props.label || this.props.children}</Ui.Link>
        );
    }
};

export default RouteAction;