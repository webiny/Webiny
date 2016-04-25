import Webiny from 'Webiny';
import SelectInput from './SelectInput';

class SelectContainer extends Webiny.Ui.Component {

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

    prepareOptions(props = null) {
        if (!props) {
            props = this.props;
        }

        const options = [];
        if (props.children) {
            React.Children.map(props.children, child => {
                let option = child.props.children;
                if (!_.isString(option)) {
                    option = ReactDOMServer.renderToStaticMarkup(option);
                }

                options.push({
                    id: child.props.value,
                    text: option
                });
            });
            return this.setState({options});
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

                    this.setState({options: this.renderOptions(props, opts, valueAttr, textAttr)});
                });
            }

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
                this.setState({options: this.renderOptions(props, apiResponse.getData().list, props.valueAttr, props.textAttr)});
            });
        }
    }

    renderOptions(props, data, valueAttr, textAttr) {
        return _.map(data, option => {
            const id = option[valueAttr || 'id'];
            let text = props.optionRenderer && props.optionRenderer(option) || option[textAttr];
            if (!_.isString(text)) {
                text = ReactDOMServer.renderToStaticMarkup(text);
            }
            // Add data to option so we can run it through selectedRenderer when item selection changes
            return {id, text, data: option};
        });
    }

    render() {
        return (
            <SelectInput {..._.omit(this.props, ['ui'])} options={this.state.options}/>
        );
    }
}

export default SelectContainer;