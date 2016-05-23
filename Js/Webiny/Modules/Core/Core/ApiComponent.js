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
            }

            config.context = {props: _.omit(context.props, ['children', 'renderer'])};
            context.api = new ApiEndpoint(context.props.api, config);
        }
    }
}

export default ApiComponent;