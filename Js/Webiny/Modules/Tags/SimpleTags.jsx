import Webiny from 'Webiny';

class Tags extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('focusTagInput,removeTag,addTag');
    }

    componentDidMount() {
        super.componentDidMount();
        this.refs.tagInput.focus();
    }

    focusTagInput() {
        this.refs.tagInput.focus();
    }

    removeTag(index) {
        const value = this.props.value;
        value.splice(index, 1);
        this.props.onChange(value);
    }

    tagExists(tag) {
        return _.find(this.props.value, data => data === tag);
    }

    addTag(e) {
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        let tags = this.props.value;
        const input = this.refs.tagInput;
        const emptyField = !input.value;
        const canRemove = emptyField && e.keyCode === 8 || e.keyCode === 46;
        const skipAdd = e.key !== 'Tab' && e.key !== 'Enter';

        if (canRemove) {
            this.removeTag(_.findLastIndex(tags));
        }

        if (skipAdd) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (emptyField || this.tagExists(input.value)) {
            return;
        }

        if (!_.isArray(tags)) {
            tags = [];
        }
        tags.push(input.value);
        input.value = '';
        this.props.onChange(tags);
        this.setState({tag: ''});
    }
}

Tags.defaultProps = {
    placeholder: 'Type and hit ENTER',
    renderer() {
        const input = {
            type: 'text',
            className: 'keyword-input',
            ref: 'tagInput',
            onKeyDown: this.addTag,
            placeholder: this.props.placeholder,
            style: {
                border: 'none',
                outline: 'none'
            }
        };

        return (
            <div className="keyword-container" onClick={this.focusTagInput}>
                <div className="tags-container">
                    {_.isArray(this.props.value) && this.props.value.map((tag, index) => (
                        <div key={tag} className="keyword-block">
                            <p>{tag}</p>
                            <i className="icon icon-cancel" onClick={this.removeTag.bind(this, index)}></i>
                        </div>
                    ))}
                    <input {...input}/>
                </div>
            </div>
        );
    }
};

export default Tags;