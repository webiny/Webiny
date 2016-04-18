import Webiny from 'Webiny';
import RadioGroup from './RadioGroup';

class RadioGroupContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {}
        };

        this.lastUsedSource = null;

        this.bindMethods('prepareOptions,renderOptions');
        Webiny.Mixins.ApiComponent.extend(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.prepareOptions(this.props);
    }

    prepareOptions(props) {
        const options = {};

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
                const opts = this.renderOptions(apiResponse.getData().list, props.valueAttr, props.textAttr);
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
            options[option[valueAttr || 'id']] = option[textAttr];
        });

        return options;
    }

    render() {
        return (
            <RadioGroup {...this.props} options={this.state.options}/>
        );
    }
}

export default RadioGroupContainer;