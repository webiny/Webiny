import BaseStore from '/Core/Base/BaseStore';

class TasksStore extends BaseStore {

	getFqn() {
		return 'Todo.Todo.TasksStore';
	}

	getService() {
		return '/todo/backend/todo/item';
	}

	init() {
		this.data = [];
		this.onAction('Todo.Todo.addTodoAction', this._onAddTask);
		this.onAction('Todo.Todo.saveTaskAction', this._onSaveTask);
		this.onAction('Todo.Todo.removeTodoAction', this._onRemoveTask);
	}

	getInitialData(){
		return this.crudList().then(response => {
			return response.getData();
		});
	}

	_onAddTask(task) {
		this.crudCreate(task);
	}

	_onSaveTask(task) {
		return this.crudUpdate(task);
	}

	_onRemoveTask(item) {
		this.crudDelete(item);
	}
}

export default TasksStore;