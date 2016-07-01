import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Search extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        _.assign(this.state, {
            query: '', // Value being searched
            preview: '', // Rendered value of selected value (value from valueLink)
            options: [],
            loading: false,
            selectedOption: -1, // Selected option index
            selectedData: null // Delected item data
        });

        this.warned = false;
        this.preventBlur = false;
        this.delay = null;
        this.currentValueIsId = false;
        this.filters = {};
        this.unwatch = _.noop;

        this.bindMethods(
            'loadOptions',
            'inputChanged',
            'selectItem',
            'selectCurrent',
            'onKeyUp',
            'onBlur',
            'renderPreview',
            'fetchValue',
            'getCurrentData'
        );

        Webiny.Mixins.ApiComponent.extend(this);

        if (this.props.filterBy) {
            // Assume the most basic form of filtering (single string)
            let name = this.props.filterBy;
            let filter = this.props.filterBy;

            // Check if filterBy is defined as array (0 => name of the input to watch, 1 => filter by field)
            if (_.isArray(this.props.filterBy)) {
                name = this.props.filterBy[0];
                filter = this.props.filterBy[1];
            }

            // Check if filterBy is defined as object
            if (_.isPlainObject(this.props.filterBy)) {
                name = this.props.filterBy.name;
                filter = this.props.filterBy.filter;
            }

            this.filterName = name;
            this.filterField = filter;

            this.unwatch = this.props.form.watch(name, newValue => this.applyFilter(newValue, name, filter));
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!props.valueLink) {
            return;
        }

        if (_.isEqual(props.valueLink.value, this.props.valueLink.value)) {
            return;
        }

        this.normalizeValue(props);
    }

    componentWillMount() {
        super.componentWillMount();
        this.normalizeValue(this.props);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unwatch();
    }

    /** Custom methods */

    /**
     * We support 3 types of values:
     * - id
     * - object
     * - random string
     *
     * @param props
     */
    normalizeValue(props) {
        if (!props.valueLink) {
            return;
        }

        const value = props.valueLink.value;

        const newState = {
            options: [],
            selectedOption: -1,
            query: '',
            preview: ''
        };

        // Try to extract ID
        let id = null;
        if (value && _.isString(value) && value.match(/^[0-9a-fA-F]{24}$/)) {
            id = value;
        } else if (value && _.isPlainObject(value)) {
            id = value.id;
            newState['selectedData'] = value;
        }

        if (!id && value) {
            newState['preview'] = value;
        } else if (id && _.isPlainObject(value)) {
            newState['preview'] = this.renderPreview(value);
        } else if (id) {
            this.api.get(this.api.getUrl(value)).then(apiResponse => {
                const data = apiResponse.getData();
                this.setState({selectedData: data, preview: this.renderPreview(data)});
            });
        }

        this.currentValueIsId = !!id;

        this.setState(newState);
    }


    getCurrentData() {
        return this.state.selectedData;
    }

    applyFilter(newValue, name, filter) {
        // If filter is a function, it needs to return a config for api created using new value
        if (_.isFunction(filter)) {
            const config = filter(newValue, this.api);
            if (_.isPlainObject(config)) {
                this.filters = config;
            }
        } else {
            // If filter is a string, create a filter object using that string as field name
            const filters = {};
            filters[filter] = _.isObject(newValue) ? newValue.id : newValue;
            this.filters = filters;
        }
        this.filters = _.pickBy(this.filters, v => !_.isNull(v) && !_.isUndefined(v) && v !== '');
    }

    loadOptions(query) {
        this.setState({query});
        clearTimeout(this.delay);

        this.delay = setTimeout(() => {
            if (_.isEmpty(this.state.query)) {
                return;
            }

            this.setState({loading: true});
            this.api.setQuery(_.merge({_searchQuery: this.state.query}, this.filters)).execute().then(apiResponse => {
                const data = apiResponse.getData();
                this.setState({options: _.get(data, 'list', data), loading: false});
            });
        }, this.props.allowFreeInput ? 300 : 500);
    }

    inputChanged(e) {
        if (this.props.valueLink && this.props.valueLink.value && this.currentValueIsId && this.props.allowFreeInput) {
            this.props.valueLink.requestChange(e.target.value);
        }
        this.setState({
            query: e.target.value,
            preview: '',
            selectedData: null
        });
        if (e.target.value.length >= 2) {
            this.loadOptions(e.target.value);
        }
    }

    onKeyUp(e) {
        this.key = e.key;

        switch (this.key) {
            case 'Backspace':
                if (_.isEmpty(this.state.query) || _.get(this.props, 'valueLink.value')) {
                    // Reset only if it is a selected value with valid mongo ID or data object
                    const id = _.get(this.props, 'valueLink.value');
                    if (this.props.allowFreeInput && _.isString(id) && !id.match(/^[0-9a-fA-F]{24}$/)) {
                        this.inputChanged(e);
                        break;
                    }
                    this.reset();
                    break;
                } else {
                    this.inputChanged(e);
                }
                break;
            case 'ArrowDown':
                this.selectNext();
                break;
            case 'ArrowUp':
                this.selectPrev();
                break;
            case 'Enter':
                e.stopPropagation();
                e.preventDefault();
                if (this.state.options.length > 0) {
                    this.selectCurrent();
                } else {
                    this.props.onEnter(e);
                }
                break;
            case 'Escape':
                this.onBlur();
                break;
            case 'Tab':
            case 'ArrowLeft':
            case 'ArrowRight':
                break;
            default:
                this.inputChanged(e);
                break;
        }
    }

    onBlur() {
        if (this.preventBlur) {
            return;
        }

        if (!this.props.allowFreeInput) {
            const state = {options: []};
            if (!_.get(this.props, 'valueLink.value')) {
                state['query'] = '';
                state['selectedOption'] = -1;
            }
            this.setState(state, this.validate);
        }

        if (this.props.allowFreeInput) {
            if (this.props.valueLink) {
                if (!this.state.selectedData && !(this.state.query === '' && this.state.preview !== '')) {
                    this.props.valueLink.requestChange(this.state.query);
                    setTimeout(this.validate, 10);
                }
            } else {
                this.props.onChange(this.state.query, this.props.container);
                this.props.container.reset();
            }
        }
    }

    selectItem(item) {
        this.preventBlur = true;
        this.setState({
            selectedOption: -1,
            query: '',
            options: [],
            preview: this.renderPreview(item),
            selectedData: item
        }, () => {
            const value = this.props.useDataAsValue ? item : item[this.props.valueAttr];
            if (this.props.valueLink) {
                this.props.valueLink.requestChange(value);
                setTimeout(this.validate, 10);
            } else {
                this.props.onChange(value, this);
                this.reset();
            }
            this.preventBlur = false;
        });
    }

    selectNext() {
        if (!this.state.options.length) {
            return;
        }

        let selected = this.state.selectedOption + 1;
        if (selected >= this.state.options.length) {
            selected = this.state.options.length - 1;
        }

        this.setState({
            selectedOption: selected,
            preview: this.renderPreview(this.state.options[selected])
        });
    }

    selectPrev() {
        if (!this.state.options.length) {
            return;
        }

        let selected = this.state.options.length - 1;
        if (this.state.selectedOption <= selected) {
            selected = this.state.selectedOption - 1;
        }

        if (selected < 0) {
            selected = 0;
        }

        this.setState({
            selectedOption: selected,
            preview: this.renderPreview(this.state.options[selected])
        });
    }

    selectCurrent() {
        if (!this.state.options.length) {
            return;
        }

        if (this.state.selectedOption === -1) {
            return;
        }

        const current = this.state.options[this.state.selectedOption];
        this.selectItem(current);
    }

    reset() {
        this.setState({
            selectedOption: -1,
            query: '',
            preview: '',
            options: [],
            selectedData: null
        }, () => {
            if (this.props.valueLink) {
                this.props.valueLink.requestChange(null);
            }

            this.props.onReset();
        });
    }

    fetchValue(item) {
        let value = _.get(item, this.props.textAttr);
        if (!value) {
            if (!this.warned) {
                console.warn(`Warning: Item attribute '${this.props.textAttr}' was not found in the results of '${this.props.name}'
                component.\nMissing or misspelled 'fields' parameter?`);
                this.warned = true;
            }
            value = item.id;
        }
        return value;
    }

    renderPreview(item) {
        if (!item) {
            return null;
        }
        return this.props.selectedRenderer.call(this, item);
    }
}

Search.defaultProps = {
    searchOperator: 'or',
    valueAttr: 'id',
    textAttr: 'name',
    onEnter: _.noop,
    onChange: _.noop,
    onReset: _.noop,
    onSearch: _.noop,
    inputIcon: 'icon-search',
    loadingIcon: 'icon-search',
    placeholder: 'Type to search',
    useDataAsValue: false,
    allowFreeInput: false,
    optionRenderer: function optionRenderer(item) {
        const value = this.fetchValue(item);
        const content = {__html: value.replace(/\s+/g, '&nbsp;')};
        return <div dangerouslySetInnerHTML={content}></div>;
    },
    selectedRenderer: function selectedRenderer(item) {
        return this.fetchValue(item);
    },
    renderOption(item, index) {
        const itemClasses = {
            selected: index === this.state.selectedOption
        };

        const linkProps = {
            onMouseDown: () => this.selectItem(item),
            onMouseOver: () => this.setState({selectedOption: index, preview: this.renderPreview(item)})
        };

        return (
            <li key={index} className={this.classSet(itemClasses)} {...linkProps}>
                <a href="javascript:void(0)">
                    {this.props.optionRenderer.call(this, item)}
                </a>
            </li>
        );
    },
    renderSearchInput() {
        const inputProps = {
            type: 'text',
            readOnly: this.props.readOnly || false,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            autoComplete: 'off',
            spellCheck: 'false',
            dir: 'auto',
            onKeyDown: this.onKeyUp,
            onBlur: this.onBlur,
            value: this.state.query || this.state.preview || '',
            onChange: this.inputChanged,
            disabled: this.isDisabled()
        };

        // Render option
        const options = this.state.options.map(this.props.renderOption.bind(this));

        let dropdownMenu = null;
        if (this.state.options.length > 0) {
            dropdownMenu = (
                <div className="autosuggest">
                    <div className="plain-search">
                        <ul>{options}</ul>
                    </div>
                </div>
            );
        }

        // Create search input
        return (
            <div className="search">
                <Ui.Link className="btn">
                    <Ui.Icon icon={this.props.loading ? this.props.loadingIcon : this.props.inputIcon}/>
                </Ui.Link>
                <input {...inputProps}/>
                {dropdownMenu}
            </div>
        );
    },
    renderer() {
        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;
        let validationIcon = null;
        if (!this.isValid()) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
            validationIcon = <span className="icon icon-bad"></span>;
        }

        const cssConfig = {
            'form-group': true,
            'search-container': true,
            'error': !this.isValid(),
            'success': this.isValid()
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                {this.props.renderSearchInput.call(this)}
                {validationIcon}
                {validationMessage}
            </div>
        );
    }
};

export default Search;
