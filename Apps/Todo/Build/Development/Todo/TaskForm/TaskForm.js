import BaseComponent from '/Core/Base/BaseComponent';

class TaskForm extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"col-sm-12\"},     React.createElement(Form, {name: \"form\"}, React.createElement(FormGroup, null, React.createElement(Label, null, \"ID\"), React.createElement(Input, {grid: \"4\", valueLink: this.linkState(\"id\"), placeholder: \"ID\", disabled: \"disabled\"}), React.createElement(Label, null, \"Created\"), React.createElement(Input, {grid: \"4\", valueLink: this.linkState(\"created\"), placeholder: \"Created\", disabled: \"disabled\"})), React.createElement(FormGroup, null, React.createElement(Label, null, \"Task\"), React.createElement(Input, {name: \"task\", grid: \"10\", valueLink: this.linkState(\"task\"), placeholder: \"Task\"})), React.createElement(FormGroup, null, React.createElement(Checkbox, {label: \"Important\", valueLink: this.linkState(\"important\")})), React.createElement(FormGroup, null, React.createElement(Checkbox, {label: \"Settings dev\", valueLink: this.linkState(\"settings.dev\"), \"bind-change\": \"onChangeDev\"})), React.createElement(FormGroup, null, React.createElement(Checkbox, {label: \"Completed\", valueLink: this.linkState(\"completed\")})), React.createElement(FormGroup, null, React.createElement(\"div\", {className: \"col-sm-offset-2 col-sm-10\"},                 React.createElement(\"button\", {className: \"btn btn-success\", type: \"submit\", onClick: this.saveTodo}, \"Save\")            )        )))";}

	getFqn(){
		return 'Todo.Todo.FormComponent';
	}

	componentDidMount() {
		super();

		this.tasksStore = this.getStore('Todo.Todo.TasksStore');
		this.tasksStore.crudGet(this.getParam('id')).then((response) => {
			this.setState(response.data);
		});
	}

	saveTodo(){
		this.trigger('Todo.Todo.saveTaskAction', this.state);
		Router.goTo('/Todo/Todo');
	}
}

export default TaskForm;
