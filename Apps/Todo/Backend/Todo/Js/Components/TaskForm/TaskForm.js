import BaseComponent from '/Core/Base/BaseComponent';

class TaskForm extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		this.tasksStore = this.getStore('Todo.Todo.TasksStore');
		this.tasksStore.crudGet(this.getParam('id')).then(response => {
			this.setState(response.getData());
		});
	}

	saveTodo(){
		this.trigger('Todo.Todo.saveTaskAction', this.state);
		Router.goTo('TodoItemList');
	}
}

export default TaskForm;
