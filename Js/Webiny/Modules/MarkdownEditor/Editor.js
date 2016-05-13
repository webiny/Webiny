import Webiny from 'Webiny';

class Editor extends Webiny.Ui.FormComponent {
	constructor(props) {
		super(props);

		this.mdEditor = null;
		this.options = null;

		this.bindMethods('getTextareaElement');
	}

	componentDidMount() {
		super.componentDidMount();

		console.log(this.getTextareaElement());

		let mdConfig = {
			element: this.getTextareaElement(),
			renderingConfig: {
				codeSyntaxHighlighting: true
			}
		};

		this.mdEditor = new SimpleMDE(mdConfig);

		this.mdEditor.codemirror.on("change", ()=> {
			this.props.valueLink.requestChange(this.mdEditor.value());
		});
	}

	componentWillReceiveProps(props) {
		if (this.mdEditor.value() != props.valueLink.value) {
			this.mdEditor.value(props.valueLink.value);
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	getTextareaElement() {
		return $(ReactDOM.findDOMNode(this)).find('textarea')[0];
	}

	onChange(e) {
		this.props.valueLink.requestChange(e.target.value);
	}
}

Editor.defaultProps = {

	renderer() {

		return (
			<div>
				<textarea></textarea>
			</div>
		);
	}
};

export default Editor;
