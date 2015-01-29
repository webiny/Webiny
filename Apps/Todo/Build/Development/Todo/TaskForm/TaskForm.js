import BaseComponent from '/Core/Base/BaseComponent';

class TaskForm extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-12">\
    <Form name="form"><FormGroup><Input grid="6" label="ID" valueLink={this.linkState("id")} placeholder="ID" disabled="disabled"/><Input grid="6" label="Created" valueLink={this.linkState("created")} placeholder="Created" disabled="disabled"/></FormGroup><FormGroup><Input grid="12" label="Task" valueLink={this.linkState("task")} placeholder="Task"/></FormGroup><FormGroup><Checkbox label="Important" valueLink={this.linkState("important")}/></FormGroup><FormGroup><Checkbox label="Completed" valueLink={this.linkState("completed")} disabled="disabled"/></FormGroup><FormGroup><div className="col-sm-offset-2 col-sm-10">\
                <button className="btn btn-success" type="submit" onClick={this.saveTodo}>Save</button>\
            </div>\
        </FormGroup></Form></div>';
	}

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

	saveTodo(){
		this.trigger('Todo.Todo.saveTaskAction', this.state);
		Router.goTo('/Todo/Todo');
	}
}

export default TaskForm;
