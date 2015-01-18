import BaseComponent from '/Core/Base/BaseComponent';

class List extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.ListComponent';
	}

	componentDidMount() {
		super();

		this.onStore('Todo.Todo.TodoStore', (store) => {
			this.setState({todos: store.getData()});
		});

		// Disable form submission
		var form = this.getNode('form');
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	getInitialState() {
		this.todoStore = this.getStore('Todo.Todo.TodoStore');
		return {
			todos: this.todoStore.getData()
		}
	}

	addTodo() {
		var todoInput = this.getNode('todoTask');
		this.trigger('Todo.Todo.addTodoAction', {task: todoInput.value});
		todoInput.value = '';
	}

	removeTodo(index) {
		this.trigger('Todo.Todo.removeTodoAction', index);
	}
}

export default List;
