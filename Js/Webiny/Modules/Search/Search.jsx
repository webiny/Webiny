import Webiny from 'Webiny';
import styles from './Styles';

/**
 * TODO: This component should be broken into SearchContainer and Search, just like Select.
 * SearchContainer should do the API stuff, and Search should only render what's passed to it.
 */
class Search extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        _.assign(this.state, {
            search: '',
            selected: null,
            options: [],
            loading: false
        });

        this.selectedId = null;
        this.api = null;
        this.delay = null;

        if (props.api) {
            if (props.api instanceof Webiny.Api.Entity) {
                this.api = props.api;
            } else {
                this.api = new Webiny.Api.Entity(props.api, props.fields);
            }
        }

        this.bindMethods(
            'setInitialData',
            'inputChanged',
            'selectItem',
            'selectCurrent',
            'onKeyUp',
            'onBlur',
            'renderPreview',
            'loadOptions',
            'getSearchInput'
        );
    }

    setInitialData(props) {
        let value = props.valueLink.value;
        if (value) {
            if (_.isPlainObject(value)) {
                value = value.id;
            }

            // If we only got an ID...
            this.selectedId = value;
            this.api.crudGet(value).then(apiResponse => {
                var data = apiResponse.getData();
                this.selectItem(data)
            });
        } else {
            this.selectedId = null;
            //this.setState({search: ''});
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        let id = props.valueLink.value;
        if (id && _.isPlainObject(id)) {
            id = id.id;
        }
        if (id != this.selectedId) {
            this.setInitialData(props);
        }
    }

    componentWillMount() {
        super.componentWillMount();
        this.setInitialData(this.props);
    }

    shouldComponentUpdate() {
        return true;
    }

    renderPreview(item) {
        return this.props.selectedRenderer.call(this, item);
    }

    loadOptions() {
        clearTimeout(this.delay);

        this.delay = setTimeout(() => {
            if (_.isEmpty(this.state.search)) {
                return;
            }

            this.setState({loading: true});
            this.api.crudList({
                _searchFields: this.props.searchFields,
                _searchOperator: this.props.operator,
                _searchQuery: this.state.search
            }).then(apiResponse => {
                const data = apiResponse.getData().list;
                this.setState({options: data, loading: false});
            });
        }, 500);
    }

    inputChanged(e) {
        this.setState({search: e.target.value});
    }

    onKeyUp(e) {
        this.key = e.key;

        switch (this.key) {
            case 'Backspace':
                if (_.isEmpty(this.state.search) || this.props.valueLink.value) {
                    this.reset();
                } else {
                    this.loadOptions();
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
            default:
                this.loadOptions();
                break;
        }
    }

    onBlur() {
        const state = {options: []};
        if (!this.props.valueLink.value) {
            state['search'] = '';
            state['selected'] = null;
        }
        this.setState(state, this.validate);
    }

    selectItem(item) {
        this.selectedId = item[this.props.valueAttr];
        this.setState({
            search: this.renderPreview(item),
            options: []
        });
        this.props.valueLink.requestChange(this.selectedId);
        this.props.onSelect(item);
        setTimeout(this.validate, 10);
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
            selected: selected,
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
            selected: selected,
            search: this.renderPreview(this.state.options[selected])
        });
    }

    selectCurrent() {
        if (!this.state.options.length) {
            return;
        }

        const current = this.state.options[this.state.selected];
        this.selectItem(current);
    }

    reset() {
        clearTimeout(this.delay);
        this.setState({
            selected: null,
            search: '',
            options: []
        });
        this.props.valueLink.requestChange(null);
        this.props.onReset();
    }

    getSearchInput() {
        const inputProps = {
            type: 'text',
            readOnly: this.props.readOnly || false,
            className: 'form-control typeahead tt-input',
            placeholder: this.props.placeholder,
            autoComplete: 'off',
            spellCheck: 'false',
            dir: 'auto',
            style: styles.ttInput,
            onKeyDown: this.onKeyUp,
            onBlur: this.onBlur,
            value: this.state.search,
            onChange: this.inputChanged,
            disabled: this.props.disabled
        };

        // Render option
        const options = this.state.options.map((item, index) => {
            const itemClasses = {
                'search-item': true,
                'search-item-selected': index === this.state.selected,
                'col-sm-12': true
            };
            return (
                <div key={index} className={this.classSet(itemClasses)} style={{padding: 10}}>
                    <a href="javascript:" onMouseDown={() => {this.selectItem(item)}}
                       onMouseOver={() => {this.setState({selected: index, search: this.renderPreview(item)});}}>
                        {this.props.optionRenderer.call(this, item)}
                    </a>
                </div>
            );
        });

        let dropdownMenu = null;
        if (this.state.options.length) {
            dropdownMenu = (
                <span style={styles.dropdownMenu}>
					<div className="tt-dataset-states">{options}</div>
				</span>
            );
        }

        // Create search input
        const iconClass = {
            'icon-search': !this.state.loading,
            'animate-spin icon-network': this.state.loading
        };

        return (
            <div className="twitter-typeahead" style={styles.outerSpan}>
                <input {...inputProps}/>
                <span className={this.classSet(iconClass)} style={styles.icon}></span>
                {dropdownMenu}
            </div>
        );
    }
}

Search.defaultProps = {
    optionRenderer: function (item) {
        let content = {__html: item[this.props.textAttr].replace(/\s+/g, '&nbsp;')};
        return <div dangerouslySetInnerHTML={content}></div>
    },
    selectedRenderer: function (item) {
        return item[this.props.textAttr];
    },
    operator: 'or',
    valueAttr: 'id',
    textAttr: 'name',
    onSelect: _.noop,
    onReset: _.noop,
    placeholder: 'Type to search',
    renderer: function renderer() {
        const input = this.getSearchInput();

        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;
        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <div className="clearfix"/>
                {input}
                {validationMessage}
            </div>
        );
    }
};

export default Search;
