import BaseStore from '/Core/Base/BaseStore';

class TaskStore extends BaseStore {

	getFqn() {
		return 'Todo.Todo.TaskStore';
	}

	getService() {
		return '/Todo/Todo/Item';
	}

	getInitialData(){
		return this.crudGet(this.getParam('id')).then((response) => {
			return response.data;
		});
	}

	_onAddTask(task) {
		this.crudCreate(task);
	}
}

export default TaskStore;