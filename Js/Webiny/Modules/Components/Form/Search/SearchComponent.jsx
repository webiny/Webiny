import InputComponent from './../Base/InputComponent';
import styles from './Styles';

class SearchComponent extends InputComponent {

	constructor() {
		super();
		this.delay = null;
		_.assign(this.state, {
			search: '',
			selected: null,
			options: [],
			loading: false
		});
		this.selectedId = null;

		this.bindMethods('setInitialData', 'inputChanged', 'selectItem', 'selectCurrent', 'onKeyUp', 'onBlur', 'renderPreview', 'loadOptions');
	}

	setInitialData(props) {
		var value = props.valueLink.value;
		if (value) {
			if (_.isPlainObject(value)) {
				value = value.id;
			}

			// If we only got an ID...
			this.selectedId = value;
			this.api.crudGet(value, {fields: props.returnFields}).then(apiResponse => {
				var data = apiResponse.getData();
				this.selectItem(data)
			});
		} else {
			this.selectedId = null;
			this.setState({search: ''});
		}
	}

	componentWillReceiveProps(props) {
		let id = props.valueLink.value;
		if(id && _.isPlainObject(id)){
			id = id.id;
		}
        if (id != this.selectedId) {
			this.setInitialData(props);
		}
	}

	componentWillMount() {
		super.componentWillMount();
		this.api = this.props.store ? this.getStore(this.props.store).getApi() : new Webiny.Api.EntityService(this.props.api);
		this.setInitialData(this.props)
	}

    shouldComponentUpdate() {
        return true;
    }

	renderPreview(item) {
		return this.props.previewRenderer(item);
	}

	loadOptions() {
		clearTimeout(this.delay);

		this.delay = setTimeout(() => {
			this.setState({loading: true});
			this.api.crudList({
				searchFields: this.props.searchFields,
				searchOperator: this.props.operator,
				searchQuery: this.state.search,
				fields: this.props.returnFields
			}).then(apiResponse => {
				var data = apiResponse.getData().data;
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
		var state = {options: []};
		if (!this.props.valueLink.value) {
			state['search'] = '';
			state['selected'] = null;
		}
		this.setState(state, this.validate);
	}

	selectItem(item){
		this.selectedId = item[this.props.selectedKey];
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

		var selected = this.state.selected;
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

		var selected = this.state.options.length - 1;
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

		var current = this.state.options[this.state.selected];
		this.selectItem(current);
	}

	reset() {
		this.setState({
			selected: null,
			search: '',
			options: []
		});
		clearTimeout(this.delay);
		this.props.valueLink.requestChange(null);
		this.props.onReset();
	}

	getSearchInput() {
		var inputProps = {
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
		var options = this.state.options.map((item, index) => {
			var itemClasses = {
				'search-item': true,
				'search-item-selected': index == this.state.selected,
				'col-sm-12': true
			};
			return (
				<div key={index} className={this.classSet(itemClasses)}>
					<a href="javascript:" onMouseDown={() => {this.selectItem(item)}}
					   onMouseOver={() => {this.setState({selected: index, search: this.renderPreview(item)});}}>
						{this.props.optionRenderer(item)}
					</a>
				</div>
			);
		});

		var dropdownMenu = null;
		if (this.state.options.length) {
			dropdownMenu = (
				<span style={styles.dropdownMenu}>
					<div className="tt-dataset-states">{options}</div>
				</span>
			);
		}

		// Create search input
		var loader = this.state.loading ? <span style={styles.loader}><img src="/backend/img/ajax-loader.gif"/></span> : null;
		var input = (
			<span className="twitter-typeahead" style={styles.outerSpan}>
				{loader}
				<input {...inputProps}/>
				{dropdownMenu}
			</span>
		);

		return input;
	}
}

SearchComponent.defaultProps = {
	optionRenderer: function (item) {
		let content = {__html: item._name.replace(/\s+/g, '&nbsp;')};
		return <div dangerouslySetInnerHTML={content}></div>
	},
	previewRenderer: function (item) {
		return item._name;
	},
	operator: 'or',
	selectedKey: 'id',
	returnFields: 'id,_name',
	onSelect: _.noop,
	onReset: _.noop
};

export default SearchComponent;
