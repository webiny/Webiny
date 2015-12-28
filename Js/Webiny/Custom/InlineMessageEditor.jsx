import ApiService from './../Lib/Api/Service';
import Component from './../Lib/Component';

class InlineMessageEditor extends Component {

	constructor() {
		super();

		this.state = {
			edit: false,
			contents: ''
		};

		this.api = new ApiService('/cms-messages');
	}

	componentWillMount() {
		this.setState({contents: _.unescape(this.props.children)});
	}

	componentDidUpdate(){
		if(this.state.edit){
			this.editor = $(ReactDOM.findDOMNode(this)).find('.editor');
			this.editor.summernote({
				airMode: true,
				onInit: () => {
					this.editor.code(_.clone(this.state.contents));
					this.editor.removeClass('panel-body');
				},
				airPopover: [
					['style', ['bold', 'italic', 'underline', 'clear']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['insert', ['link']]
				]
			});
		} else {
			this.editor.destroy();
		}
	}

	edit() {
		this.setState({edit: true});
	}

	save() {
		let newValue = this.editor.code();
		this.setState({edit: false, contents: newValue});
		this.editor.code('');

		this.api.patch(this.props.id, {message: newValue}, {}, {headers: {Authorization: Cookies.get('hkt-token')}});
	}

	cancel() {
		this.editor.code('');
		this.setState({edit: false});
	}

	componentWillUnmount() {
		this.editor.destroy();
	}

	render() {
		let contents = this.state.contents;

		let [Button, Hide] = this.inject('Form.Button,Hide');

		let style = {
			border: '2px dashed #ccc',
			padding: '5px'
		};

		let actionsStyle = {
			position: 'absolute',
			right: '10px',
			top: '-31px'
		};

		return (
			<div className="message-wrapper" style={style}>
				<div className="message-action" style={actionsStyle}>
					<Hide if={this.state.edit}>
						<Button type="primary" size="small" onClick={this.edit.bind(this)}>Edit</Button>
					</Hide>
					<Hide if={!this.state.edit}>
						<Button type="secondary" size="small" className="mr5" onClick={this.cancel.bind(this)}>Cancel</Button>
						<Button type="success" size="small" onClick={this.save.bind(this)}>Save</Button>
					</Hide>
				</div>
				<Hide if={this.state.edit}>
					<div className="message-content" dangerouslySetInnerHTML={{__html: contents}}></div>
				</Hide>
				<div className="editor"></div>
			</div>
		);
	}
}

export default InlineMessageEditor;