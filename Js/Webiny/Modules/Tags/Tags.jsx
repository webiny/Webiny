import Webiny from 'Webiny';

class Tags extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        _.assign(this.state, {
            tags: [],
            tag: ''
        });

        this.bindMethods('focusTagInput,removeTag,addTag');
    }

    componentWillMount() {
        super.componentWillMount();
        this.state.tags = this.props.valueLink.value;
    }

    componentDidMount() {
        super.componentDidMount();
        this.refs.tagInput.focus();
    }

    focusTagInput() {
        this.refs.tagInput.focus();
    }

    removeTag(index) {
        this.state.tags.splice(index, 1);
        this.setState({tags: this.state.tags}, () => {
            this.props.valueLink.requestChange(this.state.tags);
        });
    }

    tagExists(tag) {
        return _.find(this.state.tags, function tags(data) {
            return data === tag;
        });
    }

    addTag(e) {
        const emptyField = !this.refs.tagInput.value;
        const canRemove = emptyField && e.keyCode === 8 || e.keyCode === 46;
        const skipAdd = e.key !== 'Tab' && e.key !== 'Enter';

        if (canRemove) {
            this.removeTag(_.findLastIndex(this.state.tags));
        }

        if (skipAdd) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (emptyField || this.tagExists(this.refs.tagInput.value)) {
            return;
        }

        const state = this.state;
        if (!_.isArray(state.tags)) {
            state.tags = [];
        }
        state.tags.push(this.refs.tagInput.value);
        state.tag = '';
        this.setState(state, () => {
            this.props.valueLink.requestChange(this.state.tags);
        });
    }
}

Tags.defaultProps = {
    placeholder: 'Type and hit ENTER',
    renderer() {
        const input = {
            type: 'text',
            className: 'keyword-input',
            value: this.state.tag,
            ref: 'tagInput',
            onChange: e => this.setState({tag: e.target.value}),
            onKeyDown: this.addTag,
            placeholder: this.props.placeholder,
            style: {
                border: 'none',
                outline: 'none'
            }
        };

        return (
            <div className="form-group form-group--keywords">
                <label className="control-label">Tags</label>

                <div className="keyword-container" onClick={this.focusTagInput}>
                    <div className="tags-container">
                        {_.isArray(this.state.tags) && this.state.tags.map((tag, index) => (
                            <div key={tag} className="keyword-block">
                                <p>{tag}</p>
                                <i className="icon icon-cancel" onClick={this.removeTag.bind(this, index)}></i>
                            </div>
                        ))}
                        <input {...input}/>
                    </div>
                </div>
            </div>
        );
    }
};

export default Tags;

/*
 <div class="form-group form-group--keywords">
 <label class="control-label">KEYWORDS (separate keywords with comma)</label>

 <div class="fileUpload btn btn-transparent">
 <span>Insert XLS</span>
 <input id="uploadBtn" type="file" class="upload"/>
 </div>
 <div class="keyword-container">
 <div class="keyword-block">
 <p>Keyword No.1</p>
 <i class="icon icon-cancel"></i>
 </div>
 <label for="keyword_input"></label>
 <input id="keyword_input" type="text" class="keyword-input" placeholder="enter keyword"/>

 <div class="remove-keyword">
 <p><i class="icon icon-cancel"></i>remove all</p>
 </div>
 </div>
 </div>*/
