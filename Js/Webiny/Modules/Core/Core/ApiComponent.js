import ApiEndpoint from './../Api/Endpoint';

class ApiComponent {

    static extend(context) {
        if (context.props.api) {
            const apiParams = [
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
            const verifiedParams = {};
            _.each(context.props.params || {}, (v, k) => {
                if (apiParams.indexOf(k) > -1) {
                    verifiedParams['_' + k] = v;
                } else {
                    verifiedParams[k] = v;
                }
            });
            config.params = verifiedParams;
            _.each(apiParams, v => config['_' + v] = context.props[v]);
            context.api = new ApiEndpoint(context.props.api, config);
        }
    }
}

export default ApiComponent;