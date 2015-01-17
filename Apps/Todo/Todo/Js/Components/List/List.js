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

	getTemplate() {

		return '<div className="col-sm-12"> \
					<form ref="form" className="form-inline">\
						<div className="form-group">\
							<input ref="todoTask" type="text" className="form-control" placeholder="New todo" />\
							<button type="submit" onClick={this.addTodo}>Add</button>\
						</div>\
					</form>\
					<ul className="col-sm-11 col-sm-offset-1">\
						<w-loop items={this.state.todos} as="item" index="i">\
							<li>({item.id}) {item.task} <span onClick={this.removeTodo.bind(this, i)}>[x]</span></li>\
						</w-loop>\
					</ul>\
				</div>';
	}
}

export default List;
