import Webiny from 'Webiny';
import SelectInput from './SelectInput';

class SelectContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: []
        };

        this.lastUsedSource = null;

        this.bindMethods('prepareOptions,renderOptions,setFilters,watchForChange');
        Webiny.Mixins.ApiComponent.extend(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.prepareOptions(this.props);
        if (this.props.filterBy) {
            this.watchForChange();
        }
    }

    watchForChange() {
        // Assume the most basic form of filtering (single string)
        let name = this.props.filterBy;
        let field = this.props.filterBy;

        // Check if filterBy is defined as array (0 => name of the input to watch, 1 => filter by field)
        if (_.isArray(this.props.filterBy)) {
            name = this.props.filterBy[0];
            field = this.props.filterBy[1];
        }

        this.props.form.watch(name, val => {
            // If filter is a function, it needs to return a filter object created from new value
            if (_.isFunction(field)) {
                this.setFilters(field(val));
            } else {
                // If filter is a string, create a filter object using that string as field name
                const filters = {};
                filters[field] = val;
                this.setFilters(filters);
            }
        });
    }

    setFilters(filters) {
        this.api.setParams(filters);
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