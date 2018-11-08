import React from "react";
import _ from "lodash";
import Webiny from "webiny";

class RouteAction extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods("getRoute,getParams");
    }

    getRoute() {
        return _.isFunction(this.props.route)
            ? this.props.route(this.props.data)
            : this.props.route;
    }

    getUrl() {
        return _.isFunction(this.props.url) ? this.props.url(this.props.data) : this.props.url;
    }

    getParams() {
        let params = !this.props.params
            ? Webiny.Router.getRoute(this.getRoute()).paramNames
            : _.clone(this.props.params);

        if (_.isString(params) || _.isArray(params)) {
            const paramNames = _.isString(params) ? params.split(",") : params;
            params = {};
            paramNames.map(p => {
                params[p] = this.props.data[p];
            });
        }

        if (_.isFunction(params)) {
            //noinspection JSUnresolvedFunction
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
    hide: null,
    separate: false,
    renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const { Link, Icon, separate } = this.props;

        const props = {
            separate,
            params: this.getParams()
        };

        if (this.props.route) {
            props.route = this.getRoute();
        }

        if (this.props.url) {
            props.url = this.getUrl();
        }

        return (
            <Link {...props}>
                {this.props.icon ? <Icon icon={this.props.icon} /> : null}
                {this.props.label || this.props.children}
            </Link>
        );
    }
};

export default Webiny.createComponent(RouteAction, { modules: ["Link", "Icon"] });
