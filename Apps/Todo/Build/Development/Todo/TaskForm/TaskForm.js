import BaseComponent from '/Core/Base/BaseComponent';

class TaskForm extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-12"><Form name="form"><FormGroup><Label>ID</Label><Input grid="4" valueLink={this.linkState("id")} placeholder="ID" disabled="disabled"/><Label>Created</Label><Input grid="4" valueLink={this.linkState("created")} placeholder="Created" disabled="disabled"/></FormGroup><FormGroup><Label>Task</Label><Input name="task" grid="10" valueLink={this.linkState("task")} placeholder="Task"/></FormGroup><FormGroup><Checkbox label="Important" valueLink={this.linkState("important")}/></FormGroup><FormGroup><Checkbox label="Settings dev" valueLink={this.linkState("settings.dev")} bind-change="onSettingsDev"/></FormGroup><FormGroup><Checkbox label="Completed" valueLink={this.linkState("completed")}/></FormGroup><FormGroup><div className="col-sm-offset-2 col-sm-10"><button className="btn btn-success" type="submit" onClick={this.saveTodo}>Save</button></div></FormGroup></Form></div>';
	}

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
