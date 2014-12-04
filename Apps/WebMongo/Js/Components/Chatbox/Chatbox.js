import BaseComponent from 'Scripts/Core/Base/BaseComponent';
import TemplateParser from 'Scripts/Core/TemplateParser';

class ChatBox extends BaseComponent {

	getInitialState() {
		return {
			messages: []
		}
	}

	componentDidMount() {
		var form = this.refs.form.getDOMNode();
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	componentWillUpdate(nextProps, nextState) {

	}

	getTemplate() {
		var template = '<div className="component">\
					<form ref="form" className="form-inline" role="form" onkeypress="return event.keyCode != 13;">\
						<h3>ChatBox</h3>\
						<div className="form-group">\
							<input ref="message" type="text" className="form-control" placeholder="Your message" />\
						</div>\
						<button className={this.dynamic.className} type="submit" onClick={this.postMessage}>Post</button>\
						<ul>\
						<w-loop items={this.state.messages} as="msg" index="i">\
							<li>\
							<span className="grey">{msg.time.getTime()} - </span>\
							<span>{msg.message}</span>\
							</li>\
						</w-loop>\
						</ul>\
					</form>\
					<w-placeholder name="ChatBoxAddon"/>\
				</div>';
		return template;
	}

	getDynamicProperties() {
		return {
			className: "btn " + this.props.class
		}
	}

	postMessage() {
		var messageInput = this.refs.message.getDOMNode();
		var messages = this.state.messages;
		messages.push({
			message: messageInput.value,
			time: new Date()
		});

		messageInput.value = '';

		this.setState({
			messages: messages
		});
	}
}

/*var widget = new ChatBox();
 export default widget.getComponent();*/

export default ChatBox;
