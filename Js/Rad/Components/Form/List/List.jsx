import FormComponent from './../Base/FormComponent';
import HorizontalList from './HorizontalList';
import VerticalList from './VerticalList';

class List extends FormComponent {

    componentWillMount() {
        this.inputRef = Rad.Tools.createUID();
    }

    render() {
        var formType = super.getFormType();

        var props = _.clone(this.props);
        props['ref'] = this.inputRef;

        if (formType == 'vertical') {
            return React.createElement(VerticalList, props, this.props.children);
        }

        if (formType == 'horizontal') {
            return React.createElement(HorizontalList, props, this.props.children);
        }

        // Native input field
        return React.createElement('input', _.assign({}, props, {className: 'form-control'}));
    }

    getDOM() {
        return super.getDOM(this.inputRef);
    }
}

List.defaultProps = {
    disabled: false,
    placeholder: 'Type and press enter to add',
    grid: 12,
    name: null,
    type: 'text',
    unique: false,
    emptyMessage: 'No items added yet.'
};

export default List;