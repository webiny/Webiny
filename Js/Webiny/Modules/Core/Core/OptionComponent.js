import Webiny from 'Webiny';
import Component from './Component';

class OptionComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: []
        };

        this.bindMethods('prepareOptions,renderOptions,setFilters,applyFilter');
        Webiny.Mixins.ApiComponent.extend(this);
        Webiny.Mixins.FilterableComponent.extend(this);
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.filterBy || this.props.valueLink.value !== null) {
            this.prepareOptions(this.props);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.$unwatch) {
            this.$unwatch();
        }

        if (this.request) {
            this.request.abort();
        }
    }

    applyFilter(newValue, name, filter, loadIfEmpty) {
        this.props.valueLink.requestChange(null);
        if (newValue === null) {
            this.setState({options: []});
            if (!loadIfEmpty) {
                return;
            }
        }

        // If filter is a function, it needs to return a config for api created using new value
        if (_.isFunction(filter)) {
            const config = filter(newValue, this.api);
            if (_.isPlainObject(config)) {
                this.setFilters(config);
            } else {
                this.prepareOptions();
            }
        } else {
            // If filter is a string, create a filter object using that string as field name
            const filters = {};
            filters[filter] = _.isObject(newValue) ? newValue.id : newValue;
            this.setFilters(filters);
        }
    }

    setFilters(filters) {
        this.api.setQuery(filters);
        this.prepareOptions();
        return this;
    }

    prepareOptions(props = null) {
        const options = [];
        if (!props) {
            props = this.props;
        }

        if (props.options) {
            _.each(props.options, (value, key) => {
                options.push({
                    id: key,
                    text: value
                });
            });

            return this.setState({options});
        }

        if (this.api) {
            const query = {};
            if (this.props.filterBy) {
                // Get current value of the field that filters current field
                let filter = null;
                const filteredByValue = _.get(this.props.form.state.model, this.$filterName);
                if (_.isFunction(this.$filterField)) {
                    filter = this.$filterField(filteredByValue, this.api);
                    if (_.isPlainObject(filter)) {
                        _.merge(query, filter);
                    }
                }

                if (_.isString(this.$filterField)) {
                    query[this.$filterField] = filteredByValue;
                }

                this.api.setQuery(query);
            }

            this.request = this.api.execute().then(apiResponse => {
                if (apiResponse.isAborted()) {
                    return;
                }

                let data = apiResponse.getData();
                if (_.isPlainObject(data) && this.api.url === '/') {
                    data = data.list;
                }

                this.setState({options: this.renderOptions(props, data)});
            });

            return this.request;
        }

        if (props.children) {
            React.Children.map(props.children, child => {
                if (child.type === 'option') {
                    options.push({
                        id: child.props.value,
                        text: this.renderOptionText(props, child.props.children)
                    });
                }
            });
            return this.setState({options});
        }
    }

    renderOptions(props, data) {
        return _.map(data, option => {
            const id = _.isPlainObject(option) ? option[props.valueAttr || 'id'] : option;
            const text = this.renderOptionText(props, option);
            // Add data to option so we can run it through selectedRenderer when item selection changes
            return {id, text, data: option};
        });
    }

    renderOptionText(props, option) {
        if (props.optionRenderer) {
            return props.optionRenderer(option);
        } else if (_.isPlainObject(option)) {
            return _.get(option, props.textAttr);
        } else if (_.isString(option)) {
            return option;
        }
        return _.isArray(option) ? option[0] : option;
    }
}

OptionComponent.defaultProps = {
    valueAttr: 'id',
    textAttr: 'name'
};

export default OptionComponent;