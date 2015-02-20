import BaseComponent from '/Core/Base/BaseComponent';

class ChatBox extends BaseComponent {

	getFqn(){
		return 'Core.View.ChatBox';
	}

	getInitialState(){
		return {
			messages: [{
				message: 'Test',
				time: new Date()
			}]
		}
	}

	postMessage() {
		var messageInput = this.getNode('message');
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

export default ChatBox;
