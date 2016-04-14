import Webiny from 'Webiny';
import styles from './Styles';

class SearchInput extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        _.assign(this.state, {
            search: '',
            selected: null,
            options: []
        });

        this.bindMethods(
            'inputChanged',
            'selectItem',
            'selectCurrent',
            'onKeyUp',
            'onBlur',
            'renderPreview',
            'getSearchInput'
        );
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        const newState = {
            options: props.options
        };

        if (props.selected) {
            newState['selected'] = this.renderPreview(props.selected);
        }

        this.setState(newState);
    }

    renderPreview(item) {
        if (!item) {
            return null;
        }
        return this.props.selectedRenderer.call(this, item);
    }

    inputChanged(e) {
        this.setState({search: e.target.value});
        this.props.onSearch(e.target.value);
    }

    onKeyUp(e) {
        this.key = e.key;

        switch (this.key) {
            case 'Backspace':
                if (_.isEmpty(this.state.search) || this.props.valueLink.value) {
                    this.reset();
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
        const state = {options: []};
        if (!this.props.valueLink.value) {
            state['search'] = '';
            state['selected'] = null;
        }
        this.setState(state, this.validate);
    }

    selectItem(item) {
        this.setState({
            search: this.renderPreview(item),
            options: []
        });
        this.props.valueLink.requestChange(item[this.props.valueAttr]);
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
            value: this.state.search || '',
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
        if (this.state.options.length > 0) {
            dropdownMenu = (
                <span style={styles.dropdownMenu}>
					<div className="tt-dataset-states">{options}</div>
				</span>
            );
        }

        // Create search input
        const iconClass = {};
        iconClass[this.props.inputIcon] = !this.props.loading;
        iconClass[this.props.loadingIcon] = this.props.loading;

        return (
            <div className="twitter-typeahead" style={styles.outerSpan}>
                <input {...inputProps}/>
                <span className={this.classSet(iconClass)} style={styles.icon}></span>
                {dropdownMenu}
            </div>
        );
    }
}

SearchInput.defaultProps = {
    optionRenderer: function (item) {
        let content = {__html: item[this.props.textAttr].replace(/\s+/g, '&nbsp;')};
        return <div dangerouslySetInnerHTML={content}></div>
    },
    selectedRenderer: function (item) {
        return item[this.props.textAttr];
    },
    valueAttr: 'id',
    textAttr: 'name',
    onSelect: _.noop,
    onReset: _.noop,
    onSearch: _.noop,
    inputIcon: 'icon-search',
    loadingIcon: 'animate-spin icon-network',
    placeholder: 'Type to search',
    renderer: function renderer() {
        const input = this.getSearchInput();

        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;
        let validationIcon = null;
        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
            validationIcon = <span className="icon icon-bad"></span>;
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
                {validationIcon}
                {validationMessage}
            </div>
        );
    }
};

export default SearchInput;
