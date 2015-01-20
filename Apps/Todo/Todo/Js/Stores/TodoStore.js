import BaseStore from '/Core/Base/BaseStore';

class TodoStore extends BaseStore {

	getFqn() {
		return 'Todo.Todo.TodoStore';
	}

	getService() {
		return '/Todo/Todo/Item';
	}

	getInitialData(){
		this.crudList({emit: false}).then((response) => {
			this.data.forEach((item) => {
				item.task += ' CUSTOM';
			});
			this.emitChange();
			// this.emitChange(2000); => emit with 2 seconds delay
		});
	}

	init() {
		this.data = [];
		this.onAction('Todo.Todo.addTodoAction', this._onAddTask);
		this.onAction('Todo.Todo.removeTodoAction', this._onRemoveTask);
	}

	_onAddTask(task) {
		/**
		 * Simple usage
		 */
		this.crudCreate(task);

		/**
		 * Custom processing:
		 * emit=false -> will not call this.emitChange() after response from API is received (you will need to call it manually)
		 * prePush=false -> will not push the new data to this.data before request to an API is sent
		 * postPush=false -> will not push the new record to this.data after response from API is received
		 *
		 * NOTE: if prePush=true, postPush value will be ignored (set to false internally)
		 */

		this.crudCreate(task, {emit: false, prePush: false, postPush: false}).then((response) => {
			task.task += ' [custom]';
			this.data.push(task);
			this.emitChange();
		});
	}

	_onRemoveTask(item) {
		/**
		 * Simple usage
		 */
		this.crudDelete(item);

		/**
		 * Custom processing
		 * emit=false -> will not call this.emitChange() after response from API is received (you will need to call it manually)
		 * remove=false -> will not remove the record from this.data (you will have to remove it manually)
		 */
		this.crudDelete(item, {emit: false, remove: false}).then((response) => {
			// If item is a numeric index, get item Object like this
			var item = this.data[item];

			// If item is an actual Object, get item index like this
			var index = this.data.indexOf(item);

			// Remove item from this.data
			this.data.splice(index, 1);

			// Update UI
			this.emitChange();
		});
	}
}

export default TodoStore;