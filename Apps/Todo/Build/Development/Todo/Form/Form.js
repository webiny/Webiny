import BaseComponent from '/Core/Base/BaseComponent';

class Form extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-12">\
    <Form name="form"><Input label="ID" valueLink={this.linkState("id")} placeholder="ID" disabled="disabled"/><Input label="Created" valueLink={this.linkState("created")} placeholder="Created" disabled="disabled"/><Input label="Task" valueLink={this.linkState("task")} placeholder="Task"/><Checkbox label="Important" valueLink={this.linkState("important")}/><Checkbox label="Completed" valueLink={this.linkState("completed")} disabled="disabled"/><div className="form-group">\
            <div className="col-sm-offset-2 col-sm-10">\
                <button className="btn btn-success" type="submit" onClick={this.saveTodo}>Save</button>\
            </div>\
        </div>\
    </Form></div>';
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

	saveTodo(){
		console.log(this.state)
		this.trigger('Todo.Todo.saveTask', this.state)
	}
}

export default Form;
