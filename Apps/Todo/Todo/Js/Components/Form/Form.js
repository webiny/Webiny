import BaseComponent from '/Core/Base/BaseComponent';

class Form extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		super();

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');
		this.tasksStore.crudGet(this.getParam('id')).then((response) => {
			this.setState(response.data);
		});

		// Disable form submission
		var form = this.getNode('form');
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	saveTodo(){
		console.log(this.state)
		this.trigger('Todo.Todo.saveTask', this.state)
	}
}

export default Form;
