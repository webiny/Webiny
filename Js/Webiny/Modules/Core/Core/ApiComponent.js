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

            const config = _.pick(context.props, ['method', 'httpMethod', 'body']);
            const verifiedQuery = {};
            _.each(context.props.params || {}, (v, k) => {
                if (apiQuery.indexOf(k) > -1) {
                    verifiedQuery['_' + k] = v;
                } else {
                    verifiedQuery[k] = v;
                }
            });
            config.params = verifiedQuery;
            _.each(apiQuery, v => config['_' + v] = context.props[v]);
            context.api = new ApiEndpoint(context.props.api, config);
        }
    }
}

export default ApiComponent;