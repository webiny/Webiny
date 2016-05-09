import ApiEndpoint from './../Api/Endpoint';

class ApiComponent {

    static extend(context) {
        if (context.props.api) {
            const apiProps = [
                'fields',
                'page',
                'perPage',
                'sort',
                'searchFields',
                'searchQuery',
                'searchOperator'
            ];

            const config = _.pick(context.props, ['httpMethod', 'url', 'body', 'query']);
            if (!config.query || _.isPlainObject(config.query)) {
                config.query = _.merge({}, config.query, _.pick(context.props, apiProps));
            } else if (_.isFunction(config.query)) {
                config.dynamicQuery = config.query;
                config.query = _.pick(context.props, apiProps);
            }

            config.context = {props: _.omit(context.props, ['children', 'renderer'])};

            let api = null;
            if (_.isFunction(context.props.api)) {
                api = context.props.api.call(context, context);
            } else {
                api = new ApiEndpoint(context.props.api, config);
            }
            context.api = api;
        }
    }
}

export default ApiComponent;