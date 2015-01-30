import BaseComponent from '/Core/Base/BaseComponent';

class TaskForm extends BaseComponent {

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		super();

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');
		this.tasksStore.crudGet(this.getParam('id')).then((response) => {
			response.data.settings = {
				dev: true
			};
			this.setState(response.data);
		});
	}

	/*onChangeImportant(newValue, oldValue) {
		console.log("Important __magic__ checkbox changed: ", newValue);
	}

	changeImportant(newValue, oldValue) {
		console.log("Important __manual__ checkbox changed: ", newValue);
	}*/

	onSettingsDev(newValue, oldValue) {
		console.log("Settings dev changed: ", newValue);
	}

	saveTodo(){
		this.trigger('Todo.Todo.saveTaskAction', this.state);
		Router.goTo('/Todo/Todo');
	}
}

export default TaskForm;
