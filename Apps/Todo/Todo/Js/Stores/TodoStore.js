import BaseStore from '/Core/Base/BaseStore';
import Http from '/Core/Http';

class TodoStore extends BaseStore {

	getFqn() {
		return 'Todo.Todo.TodoStore';
	}

	getSource() {
		return '/Todo/Todo/Item';
	}

	init() {
		this.data = [];
		this.onAction('Todo.Todo.addTodoAction', this._onAddTask);
		this.onAction('Todo.Todo.removeTodoAction', this._onRemoveTask);
	}

	_onAddTask(task) {
		this.data.push(task);

		Http.post(_apiUrl + this.getSource(), task).then((res) => {
			if (!res.error) {
				task.id = res.data.id;
				this.emitChange();
			}
		});
		this.emitChange();
	}

	_onRemoveTask(index) {
		var task = this.data[index];
		this.data.splice(index, 1);
		this.emitChange();
		Http.delete(_apiUrl + this.getSource()+'/'+task.id);
	}
}

export default TodoStore;