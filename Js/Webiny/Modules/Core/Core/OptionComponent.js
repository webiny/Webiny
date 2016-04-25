import Webiny from 'Webiny';
import Component from './Component';

class OptionComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: []
        };

        this.unwatch = _.noop;
        this.lastUsedSource = null;

        this.bindMethods('prepareOptions,renderOptions,setFilters,applyFilter');
        Webiny.Mixins.ApiComponent.extend(this);
        Webiny.Mixins.FilterableComponent.extend(this);
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.filterBy) {
            this.prepareOptions(this.props);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unwatch();
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
            if (config) {
                this.setFilters(config);
            } else {
                this.prepareOptions();
            }
        } else {
            // If filter is a string, create a filter object using that string as field name
            const filters = {};
            filters[filter] = newValue;
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
            // TODO: on unmount - abort api request (when new HTTP is implemented)
            return this.api.execute().then(apiResponse => {
                let data = apiResponse.getData();
                if (_.isPlainObject(data) && this.api.method === '/') {
                    data = data.list;
                }

                this.setState({options: this.renderOptions(props, data)});
            });
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
            const id = option[props.valueAttr || 'id'];
            const text = this.renderOptionText(props, option);
            // Add data to option so we can run it through selectedRenderer when item selection changes
            return {id, text, data: option};
        });
    }

    renderOptionText(props, option) {
        if (props.optionRenderer) {
            return props.optionRenderer(option);
        } else if (_.isPlainObject(option)) {
            return option[props.textAttr];
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