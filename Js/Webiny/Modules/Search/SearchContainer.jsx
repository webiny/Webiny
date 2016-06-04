import Webiny from 'Webiny';
import SearchInput from './SearchInput';

class SearchContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            loading: false,
            selected: null
        };

        this.selectedId = null;
        this.delay = null;

        this.bindMethods(
            'setInitialData',
            'loadOptions',
            'getCurrentData'
        );

        Webiny.Mixins.ApiComponent.extend(this);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!props.valueLink) {
            return;
        }

        this.setState({options: []});

        let id = props.valueLink.value;

        const isMongoId = id && id.match(/^[0-9a-fA-F]{24}$/);

        if (id && _.isPlainObject(id)) {
            id = id.id;
        }

        if (id !== this.selectedId && isMongoId) {
            this.setInitialData(props);
        }

        if (!id) {
            this.selectedId = null;
            this.setState({
                options: [],
                selected: false,
                search: ''
            });
        }

        if (_.isString(id) && !isMongoId) {
            this.setState({
                options: [],
                selected: false,
                search: id
            });
        }
    }

    componentWillMount() {
        super.componentWillMount();
        this.setInitialData(this.props);
    }

    getCurrentData() {
        return this.refs.input.getCurrentData();
    }

    setInitialData(props) {
        if (!props.valueLink) {
            return;
        }

        let value = props.valueLink.value;
        if (value) {
            if (_.isPlainObject(value)) {
                value = value[this.props.valueAttr];
            }

            // If we only got an ID...
            this.selectedId = value;
            this.api.get(value).then(apiResponse => {
                this.setState({selected: apiResponse.getData()});
            });
        } else {
            this.selectedId = null;
        }
    }

    loadOptions(query) {
        this.setState({search: query});
        clearTimeout(this.delay);

        this.delay = setTimeout(() => {
            if (_.isEmpty(this.state.search)) {
                return;
            }

            this.setState({loading: true});
            this.api.setQuery({_searchQuery: this.state.search}).execute().then(apiResponse => {
                const data = apiResponse.getData();
                this.setState({options: _.get(data, 'list', data), loading: false});
            });

            if (this.props.allowFreeInput) {
                this.props.valueLink.requestChange(query);
            }
        }, 500);
    }

    reset() {
        this.setState({
            options: [],
            selected: null,
            search: ''
        });
    }

    render() {
        const props = _.omit(this.props, ['key', 'ref']);
        _.assign(props, {
            ref: 'input',
            loading: this.state.loading,
            options: this.state.options,
            onSearch: this.loadOptions,
            selected: this.state.selected,
            container: this
        });
        return <SearchInput {...props}/>;
    }

}

SearchContainer.defaultProps = {
    searchOperator: 'or',
    valueAttr: 'id',
    textAttr: 'name',
    onReset: _.noop,
    placeholder: 'Type to search',
    allowFreeInput: false
};

export default SearchContainer;
