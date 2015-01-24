import BaseComponent from '/Core/Base/BaseComponent';

class Form extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		super();

		// Disable form submission
		var form = this.getNode('form');
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	getInitialState() {
		this.taskStore = this.getStore('Todo.Todo.TaskStore');
		return {};
		return this.taskStore.getData().then((data) => {
			console.log(data)
			this.setState(data || {});
		});
	}

	saveTodo(){
		console.log(this.state)
		this.trigger('Todo.Todo.saveTask', this.state)
	}
}

export default Form;
