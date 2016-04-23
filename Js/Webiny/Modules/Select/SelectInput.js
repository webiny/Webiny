import Webiny from 'Webiny';

class SelectInput extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.select2 = null;
        this.options = null;
        this.bindMethods('getConfig,getValue,triggerChange,getSelect2InputElement');
    }

    componentDidMount() {
        super.componentDidMount();
        this.select2 = this.getSelect2InputElement().select2(this.getConfig(this.props));
        this.select2.on('select2:select', e => {
            this.triggerChange(e.target.value);
        });
        this.select2.on('select2:unselect', () => {
            this.triggerChange('');
        });
        this.select2.val(this.getValue()).trigger('change');
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!this.options || !_.isEqual(props.options, this.options)) {
            this.select2.html('');
        }

        this.getSelect2InputElement().select2(this.getConfig(props));
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        const possibleValues = _.map(this.options, 'id');
        const value = this.getValue();
        const inPossibleValues = possibleValues.indexOf(value) > -1;

        if (value !== null && !inPossibleValues && possibleValues.length > 0) {
            this.triggerChange(null);
            return;
        }

        if (value !== null && inPossibleValues) {
            this.select2.val(value).trigger('change');
            return;
        }

        this.select2.val('').trigger('change');
    }

    getSelect2InputElement() {
        return $(ReactDOM.findDOMNode(this)).find('select');
    }

    getValue() {
        const value = this.props.valueLink ? this.props.valueLink.value : this.props.selectedValue;
        if (value === null || value === undefined) {
            return value;
        }

        return _.isObject(value) ? value.id : '' + value;
    }

    triggerChange(value) {
        if (this.props.valueLink) {
            if (this.props.multiple) {
                const newValue = this.props.valueLink.value;
                newValue.push(value);
                value = newValue;
            }
            this.props.valueLink.requestChange(value);
        }
        this.props.onChange(value);
    }

    getConfig(props) {
        const renderer = function renderer(item) {
            // If HTML - convert to jQuery object
            if (item.text.indexOf('<') === 0) {
                return $(item.text);
            }
            return item.text;
        };

        let selectedRenderer = renderer;
        if (_.isFunction(props.selectedRenderer)) {
            selectedRenderer = function preview(item) {
                if (item.data) {
                    let option = props.selectedRenderer(item.data);
                    if (!_.isString(option)) {
                        option = $(ReactDOMServer.renderToStaticMarkup(option));
                    }
                    return option;
                }

                return item.text || '';
            };
        }

        const config = {
            disabled: this.isDisabled(props),
            minimumResultsForSearch: props.minimumResultsForSearch,
            placeholder: this.props.placeholder,
            allowClear: props.allowClear,
            templateResult: renderer,
            templateSelection: selectedRenderer,
            multiple: props.multiple
        };

        if (!this.options || !_.isEqual(props.options, this.options)) {
            config['data'] = this.options = props.options;
        }

        return config;
    }
}

SelectInput.defaultProps = {
    allowClear: false,
    placeholder: null,
    onChange: _.noop,
    selectedValue: '',
    minimumResultsForSearch: 15,
    multiple: false,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;

        if (this.state.isValid === false) {
            validationMessage = <span className="info-txt">({this.state.validationMessage})</span>;
        }

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <select style={{'width': '100%'}}/>
                {validationMessage}
            </div>
        );
    }
};

export default SelectInput;