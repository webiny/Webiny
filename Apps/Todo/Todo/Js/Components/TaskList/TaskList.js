import BaseComponent from '/Core/Base/BaseComponent';

class TaskList extends BaseComponent {

	getFqn() {
		return 'Todo.Todo.ListComponent';
	}

	componentDidMount() {
		super();

		this.fullListOfTasks = [];

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');

		// Get initial data
		this.tasksStore.getData().then((data) => {
			this.fullListOfTasks = data;
			this.setState({todos: data});
		});

		// Listen to store changes
		this.onStore('Todo.Todo.TasksStore', (store) => {
			store.getData().then((data) => {
				this.setState({todos: data});
			});
		});
	}

	getInitialState() {
		return {
			todos: [],
			task: '',
			filter: ''
		};
	}

	addTodo() {
		this.trigger('Todo.Todo.addTodoAction', {task: this.state.task});
		this.setState({task: ''});
	}

	removeTodo(id) {
		this.trigger('Todo.Todo.removeTodoAction', id);
	}

	editTask(item) {
		Router.goTo('/Todo/Todo/' + item)
	}

	onChangeFilter(newValue, oldValue) {
		if(!newValue){
			return this.setState({todos: this.fullListOfTasks});
		}
		var filter = newValue.toLowerCase();
		var results = [];
		this.fullListOfTasks.forEach((task) => {
			if (task.task.toLowerCase().indexOf(filter) > -1) {
				results.push(task);
			}
		});
		this.setState({todos: results});
	}
}

export default TaskList;
