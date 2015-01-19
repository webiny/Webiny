import BaseStore from '/Core/Base/BaseStore';

class TodoStore extends BaseStore {

	getFqn() {
		return 'Todo.Todo.TodoStore';
	}

	getService() {
		return '/Todo/Todo/Item';
	}

	init() {
		this.data = [];
		this.onAction('Todo.Todo.addTodoAction', this._onAddTask);
		this.onAction('Todo.Todo.removeTodoAction', this._onRemoveTask);
	}

	_onAddTask(task) {
		this.crudCreate(task);
	}

	_onRemoveTask(index) {
		this.crudDelete(index);
	}
}

export default TodoStore;