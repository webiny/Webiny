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

            _.each(apiQuery, v => {
                if (_.has(context.props, v)) {
                    config.query['_' + v] = context.props[v];
                }
            });

            // _fields must be in the defaultQuery
            if (_.has(config.query, '_fields')) {
                config.defaultQuery['_fields'] = config.query._fields;
                delete config.query._fields;
            }

            context.api = _.isFunction(context.props.api) ? context.props.api.call(context, context) : new ApiEndpoint(context.props.api, config);
        }
    }
}

export default ApiComponent;