import BaseComponent from '/Core/Base/BaseComponent';

class Form extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		super();

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');
		this.tasksStore.crudGet(this.getParam('id')).then((response) => {
			response.data.settings = {
				dev: true
			};
			this.setState(response.data);
		});
	}

	saveTodo(){
		console.log(this.state)
		this.trigger('Todo.Todo.saveTask', this.state)
	}
}

export default Form;
