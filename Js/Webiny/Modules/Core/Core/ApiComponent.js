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
                'searchOperator',
                'fieldsDepth'
            ];

            const config = _.pick(context.props, ['httpMethod', 'url', 'body', 'defaultBody']);
            const verifiedQuery = {};
            _.each(context.props.query || {}, (v, k) => {
                if (apiQuery.indexOf(k) > -1) {
                    verifiedQuery['_' + k] = v;
                } else {
                    verifiedQuery[k] = v;
                }
            });

            config.query = verifiedQuery;

            const verifiedDefaultQuery = {};
            _.each(context.props.defaultQuery || {}, (v, k) => {
                if (apiQuery.indexOf(k) > -1) {
                    verifiedDefaultQuery['_' + k] = v;
                } else {
                    verifiedDefaultQuery[k] = v;
                }
            });

            config.defaultQuery = verifiedDefaultQuery;
            _.each(apiQuery, v => config['_' + v] = context.props[v]);

            console.log("CONFIG", config);

            // In case any of these query params are set through props, assign them to query params (we only want these for initial Endpoint setup)
            const query = ['_fields', '_page', '_perPage', '_sort', '_searchFields', '_searchQuery', '_searchOperator', '_fieldsDepth'];
            _.merge(config.query, _.pick(config, query));
            context.api = _.isFunction(context.props.api) ? context.props.api.call(context, context) : new ApiEndpoint(context.props.api, config);
        }
    }
}

export default ApiComponent;