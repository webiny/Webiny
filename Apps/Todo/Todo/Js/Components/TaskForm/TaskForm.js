import BaseComponent from '/Core/Base/BaseComponent';

class TaskForm extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		super();

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');
		this.tasksStore.crudGet(this.getParam('id')).then((response) => {
			this.setState(response.data);
		});
	}

	saveTodo(){
		this.trigger('Todo.Todo.saveTaskAction', this.state);
		Router.goTo('/Todo/Todo');
	}
}

export default TaskForm;
