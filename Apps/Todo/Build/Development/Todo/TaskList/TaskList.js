import BaseComponent from '/Core/Base/BaseComponent';

class TaskList extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"col-sm-12\"},     React.createElement(Form, {name: \"form\"}, React.createElement(FormGroup, null, React.createElement(Label, null, \"Create new item\"), React.createElement(Input, {grid: \"2\", placeholder: \"New task\", ref: \"newTask\"}), React.createElement(\"button\", {className: \"btn btn-primary col-sm-2\", type: \"submit\", onClick: this.addTask}, \"Add\"),             React.createElement(Label, null, \"Filter items\"), React.createElement(Input, {grid: \"4\", valueLink: this.linkState(\"filter\"), placeholder: \"Filter...\"}))),     function(){if(this.state.todos.length == 0){return React.createElement(\"wdiv\", null, \"No items available yet...\")}}.bind(this)(),     React.createElement(Table, {className: this.classSet({'table-hover': this.state.filter != ''}), \"class-obj\": {'table-hover': this.state.filter != ''}}, React.createElement(Thead, null, React.createElement(Tr, null, React.createElement(Th, null, \"#\"), React.createElement(Th, null, \"ID\"), React.createElement(Th, null, \"Task\"), React.createElement(Th, null, \"Created On\"), React.createElement(Th, null, \"Actions\"))), React.createElement(Tbody, null,             this.state.todos.map(function(item, i){return React.createElement(Tr, {key: i, className: this.classSet({danger: item.important, success: item.completed}), \"class-obj\": {danger: item.important, success: item.completed}}, React.createElement(Td, null, i+1), React.createElement(Td, null,                         function(){if(item.id){return React.createElement(\"wdiv\", null, item.id)}}.bind(this)()                    ), React.createElement(Td, null, item.task), React.createElement(Td, null, item.created), React.createElement(Td, null,                         function(){if(item.id){return React.createElement(\"wdiv\", null, React.createElement(Link, {className: \"btn btn-primary\", href: \"\/Todo\/Todo\/:id\", params: item}, \"Edit\"),                             \"\u00a0\",                             React.createElement(\"button\", {className: \"btn btn-danger\", onClick: this.removeTask.bind(this, item)}, \"Delete\"))} else { return React.createElement(\"wdiv\", null, \"Saving...\");}}.bind(this)()                    ))}.bind(this))        )))";}

	getFqn() {
		return 'Todo.Todo.ListComponent';
	}

	componentDidMount() {
		super();

		this.fullListOfTasks = [];
		this.tasksStore = this.getStore('Todo.Todo.TasksStore');

		// Get initial data
		this.tasksStore.getData().then((data) => {
			this.fullListOfTasks = data;
			this.setState({todos: data});
		});

		// Listen to store changes
		this.onStore(this.tasksStore, (data) => {
			this.setState({todos: data});
		});
	}

	getInitialState() {
		return {
			todos: [],
			filter: ''
		};
	}

	addTask() {
		var input = this.getNode('newTask');
		this.trigger('Todo.Todo.addTodoAction', {task: input.value});
		input.value = '';
	}

	removeTask(id) {
		//var id = $(e.target).attr('data-id');
		this.trigger('Todo.Todo.removeTodoAction', id);
	}

	onChangeFilter(newValue, oldValue) {
		if (!newValue) {
			return this.setState({todos: this.fullListOfTasks});
		}
		var filter = newValue.toLowerCase();
		var results = [];
		this.fullListOfTasks.forEach((task) => {
			if (task.task.toLowerCase().indexOf(filter) > -1) {
				results.push(task);
			}
		});
		this.setState({todos: results});
	}
}

export default TaskList;
