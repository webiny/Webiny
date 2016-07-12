import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class RouteAction extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('getRoute,getParams');
    }

    getRoute() {
        return _.isFunction(this.props.route) ? this.props.route(this.props.data) : this.props.route;
    }

    getParams() {
        let params = !this.props.params ? Webiny.Router.getRoute(this.getRoute()).paramNames : _.clone(this.props.params);

        if (_.isString(params) || _.isArray(params)) {
            const paramNames = _.isString(params) ? params.split(',') : params;
            params = {};
            paramNames.map(p => {
                params[p] = this.props.data[p];
            });
        }

        if (_.isFunction(params)) {
            params = params(this.props.data);
        }
        return params;
    }
}

RouteAction.defaultProps = {
    params: null,
    route: null,
    data: {},
    label: null,
    renderer() {
        return (
            <Ui.Link route={this.getRoute()} params={this.getParams()}>
                {this.props.icon ? <Ui.Icon icon={this.props.icon}/> : null}
                {this.props.label || this.props.children}
            </Ui.Link>
        );
    }
};

export default RouteAction;