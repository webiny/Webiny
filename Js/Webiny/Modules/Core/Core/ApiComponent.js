import ApiEndpoint from './../Api/Endpoint';

class ApiComponent {

    static extend(context) {
        if (context.props.api) {
            const apiQuery = [
                'fields',
                'page',
                'perPage',
                'sort',
                'searchFields',
                'searchQuery',
                'searchOperator'
            ];

            const config = _.pick(context.props, ['httpMethod', 'url', 'body']);

            const verifiedQuery = {};
            _.each(_.merge({}, context.props.query, context.props.defaultQuery), (v, k) => {
                if (apiQuery.indexOf(k) > -1) {
                    verifiedQuery['_' + k] = v;
                } else {
                    verifiedQuery[k] = v;
                }
            });
            config.query = verifiedQuery;

            _.each(apiQuery, v => {
                if (_.has(context.props, v)) {
                    config.query['_' + v] = context.props[v];
                }
            });

            context.api = _.isFunction(context.props.api) ? context.props.api.call(context, context) : new ApiEndpoint(context.props.api, config);
        }
    }
}

export default ApiComponent;