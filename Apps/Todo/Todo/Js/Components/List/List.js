import BaseComponent from '/Core/Base/BaseComponent';

class List extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.ListComponent';
	}

	componentDidMount() {
		super();

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
		return {
			todos: []
		}
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
		Router.goTo('/Todo/Todo/'+item)
	}
}

export default List;
