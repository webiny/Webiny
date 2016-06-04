import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SearchInput extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        _.assign(this.state, {
            search: '',
            selected: null,
            selectedData: null,
            options: []
        });

        this.warned = false;
        this.preventBlur = false;

        this.bindMethods(
            'inputChanged',
            'selectItem',
            'selectCurrent',
            'onKeyUp',
            'onBlur',
            'renderPreview',
            'fetchValue',
            'getCurrentData'
        );
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        const newState = {
            options: props.options,
            selected: null
        };

        if (props.selected) {
            newState['selected'] = this.renderPreview(props.selected);
            newState['search'] = '';
        }

        this.setState(newState);
    }

    getCurrentData() {
        if (this.props.useDataAsValue) {
            return this.props.valueLink.value;
        }

        return this.state.selectedData;
    }

    renderPreview(item) {
        if (!item) {
            return null;
        }
        return this.props.selectedRenderer.call(this, item);
    }

    inputChanged(e) {
        this.setState({search: e.target.value});
        if (e.target.value.length >= 2) {
            this.props.onSearch(e.target.value);
        }
    }

    onKeyUp(e) {
        this.key = e.key;

        switch (this.key) {
            case 'Backspace':
                if (_.isEmpty(this.state.search) || _.get(this.props, 'valueLink.value')) {
                    // Reset only if it is a selected value with valid mongo ID or data object
                    const id = this.props.valueLink.value;
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
                this.selectCurrent();
                break;
            case 'Escape':
                this.onBlur();
                break;
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
                state['search'] = '';
                state['selected'] = null;
            }
            this.setState(state, this.validate);
        }

        if (this.props.allowFreeInput) {
            if (this.props.valueLink) {
                if (!this.state.selectedData) {
                    this.props.valueLink.requestChange(this.state.search);
                    setTimeout(this.validate, 10);
                }
            } else {
                this.props.onChange(this.state.search, this.props.container);
                this.props.container.reset();
            }
        }
    }

    selectItem(item) {
        const search = this.props.valueLink ? this.renderPreview(item) : '';
        this.preventBlur = true;
        this.setState({
            selected: null,
            search,
            options: [],
            selectedData: item
        }, () => {
            const value = this.props.useDataAsValue ? item : item[this.props.valueAttr];
            if (this.props.valueLink) {
                this.props.valueLink.requestChange(value);
                setTimeout(this.validate, 10);
            } else {
                this.props.onChange(value, this.props.container);
                this.props.container.reset();
            }
            this.preventBlur = false;
        });
    }

    selectNext() {
        if (!this.state.options.length) {
            return;
        }

        let selected = this.state.selected;
        if (selected === null) {
            selected = -1;
        }
        selected++;

        if (selected >= this.state.options.length) {
            selected = this.state.options.length - 1;
        }

        this.setState({
            selected,
            search: this.renderPreview(this.state.options[selected])
        });
    }

    selectPrev() {
        if (!this.state.options.length) {
            return;
        }

        let selected = this.state.options.length - 1;
        if (this.state.selected <= selected) {
            selected = this.state.selected - 1;
        }

        if (selected < 0) {
            selected = 0;
        }

        this.setState({
            selected,
            search: this.renderPreview(this.state.options[selected])
        });
    }

    selectCurrent() {
        if (!this.state.options.length) {
            return;
        }

        if (this.state.selected === null) {
            return;
        }

        const current = this.state.options[this.state.selected];
        this.selectItem(current);
    }

    reset() {
        this.setState({
            selected: null,
            search: '',
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
}

SearchInput.defaultProps = {
    optionRenderer: function optionRenderer(item) {
        const value = this.fetchValue(item);
        const content = {__html: value.replace(/\s+/g, '&nbsp;')};
        return <div dangerouslySetInnerHTML={content}></div>;
    },
    selectedRenderer: function selectedRenderer(item) {
        return this.fetchValue(item);
    },
    valueAttr: 'id',
    textAttr: 'name',
    onChange: _.noop,
    onReset: _.noop,
    onSearch: _.noop,
    inputIcon: 'icon-search',
    loadingIcon: 'icon-search',
    placeholder: 'Type to search',
    useDataAsValue: false,
    allowFreeInput: false,
    renderOption(item, index) {
        const itemClasses = {
            selected: index === this.state.selected
        };

        const linkProps = {
            onMouseDown: () => this.selectItem(item),
            onMouseOver: () => this.setState({selected: index, search: this.renderPreview(item)})
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
            value: this.state.search || this.state.selected || '',
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

export default SearchInput;
