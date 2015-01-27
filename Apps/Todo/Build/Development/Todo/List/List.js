import BaseComponent from '/Core/Base/BaseComponent';

class List extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-12">\
    <form ref="form" className="form-inline">\
        <div className="form-group">\
            <label>Create new item</label>\
            <input ref="todoTask" type="text" className="form-control" placeholder="New todo"/><button className="btn btn-primary" type="submit" onClick={this.addTodo}>Add</button>\
        </div>\
        <div className="form-group">\
            <label>Filter items</label>\
            <input ref="todoTaskSearch" onChange={this.filterTasks} type="text" className="form-control" placeholder="Filter..."/></div>\
    </form>\
    {function(){if(this.state.todos.length == 0){return <wdiv>No items available yet...</wdiv>}}.bind(this)()}<table className="table"><thead><tr><th>#</th>\
            <th>ID</th>\
            <th>Task</th>\
            <th>Created On</th>\
            <th>Actions</th>\
        </tr></thead><tbody>\
{this.state.todos.map(function(item, i){return (<tr key={i} className={this.classSet({danger: item.important})}><td>{i+1}</td>\
                <td>\
                    {function(){if(item.id){return <wdiv>{item.id}</wdiv>}}.bind(this)()}</td>\
                <td>{item.task}</td>\
                <td>{item.created}</td>\
                <td>\
                    {function(){if(item.id){return <wdiv><Link className="btn btn-primary" href="/Todo/Todo/:id?important=:important" params={item}>Edit</Link>&nbsp;\
                        <button className="btn btn-danger" onClick={this.removeTodo.bind(this, item)}>Delete</button></wdiv>} else { return <wdiv>Saving...</wdiv>;}}.bind(this)()}</td>\
            </tr>)}.bind(this))}</tbody></table></div>';
	}

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
		this.onStore('Todo.Todo.TasksStore', (store) => {
			store.getData().then((data) => {
				this.setState({todos: data});
			});
		});

		// Disable form submission
		var form = this.getNode('form');
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	getInitialState() {
		return {todos: []};
	}

	addTodo() {
		var todoInput = this.getNode('todoTask');
		this.trigger('Todo.Todo.addTodoAction', {task: todoInput.value});
		todoInput.value = '';
	}

	removeTodo(id) {
		this.trigger('Todo.Todo.removeTodoAction', id);
	}

	editTask(item) {
		Router.goTo('/Todo/Todo/' + item)
	}

	filterTasks() {
		var filter = this.getNode('todoTaskSearch').value.toLowerCase();
		var results = [];
		this.fullListOfTasks.forEach((task) => {
			if(task.task.toLowerCase().indexOf(filter) > -1){
				results.push(task);
			}
		});
		this.setState({todos: results});
	}
}

export default List;
