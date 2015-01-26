import BaseComponent from '/Core/Base/BaseComponent';

class List extends BaseComponent {

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

		// Disable form submission
		var form = this.getNode('form');
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	getInitialState() {
		return {todos: []};
	}

	addTodo() {
		var todoInput = this.getNode('todoTask');
		this.trigger('Todo.Todo.addTodoAction', {task: todoInput.value});
		todoInput.value = '';
	}

	removeTodo(id) {
		this.trigger('Todo.Todo.removeTodoAction', id);
	}

	editTask(item) {
		Router.goTo('/Todo/Todo/' + item)
	}

	filterTasks() {
		var filter = this.getNode('todoTaskSearch').value.toLowerCase();
		var results = [];
		this.fullListOfTasks.forEach((task) => {
			if(task.task.toLowerCase().indexOf(filter) > -1){
				results.push(task);
			}
		});
		this.setState({todos: results});
	}
}

export default List;
