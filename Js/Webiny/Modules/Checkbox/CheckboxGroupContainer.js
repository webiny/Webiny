import Webiny from 'Webiny';
import CheckboxGroup from './CheckboxGroup';

class CheckboxGroupContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {}
        };

        this.unwatch = _.noop;

        this.bindMethods('prepareOptions,renderOptions,applyFilter');

        Webiny.Mixins.ApiComponent.extend(this);
        Webiny.Mixins.FilterableComponent.extend(this);
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.filterBy) {
            this.prepareOptions(this.props);
        }
    }

    componentWillUnmount(){
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

    prepareOptions(props) {
        const options = {};
        if (!props) {
            props = this.props;
        }

        if (props.options) {
            // Possible scenarios: function, object with key:value pairs
            if (_.isFunction(props.options)) {
                if (props.options === this.lastUsedSource) {
                    return null;
                }
                this.lastUsedSource = props.options;

                return Q(props.options()).then(opts => {
                    const valueAttr = opts.valueAttr || props.valueAttr;
                    const textAttr = opts.textAttr || props.textAttr;

                    if (_.isPlainObject(opts)) {
                        opts = opts.data;
                    }

                    this.setState({options: this.renderOptions(opts, valueAttr, textAttr)});
                });
            }

            return this.setState({options: props.options});
        }

        if (this.api) {
            return this.api.execute().then(apiResponse => {
                let data = apiResponse.getData();
                if (_.isPlainObject(data) && this.api.method === '/') {
                    data = data.list;
                }

                const opts = this.renderOptions(data, props.valueAttr, props.textAttr);
                this.setState({options: opts});
            });
        }

        if (props.children) {
            React.Children.map(props.children, child => {
                if (child.type === 'option') {
                    options[child.props.value] = child.props.children;
                }
            });
            return this.setState({options});
        }
    }

    renderOptions(data, valueAttr, textAttr) {
        const options = {};
        _.each(data, option => {
            if (_.isPlainObject(option)) {
                options[option[valueAttr || 'id']] = option[textAttr];
            } else {
                options[option] = option;
            }
        });

        return options;
    }

    render() {
        return (
            <CheckboxGroup {...this.props} options={this.state.options}/>
        );
    }
}

export default CheckboxGroupContainer;