import BaseComponent from '/Core/Base/BaseComponent';

class List extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-12">\
    <form ref="form" className="form-inline">\
        <div className="form-group">\
            <input ref="todoTask" type="text" className="form-control" placeholder="New todo"/><button type="submit" onClick={this.addTodo}>Add</button>\
        </div>\
    </form>\
    {function(){if(this.state.todos.length == 0){return <wdiv>No items available yet...</wdiv>}}.bind(this)()}<ul className="col-sm-11 col-sm-offset-1">\
{this.state.todos.map(function(item, i){return (<li key={i}>\
                {function(){if(item.id){return <wdiv>({item.id})</wdiv>}}.bind(this)()} {item.task}\
                {function(){if(item.id){return <wdiv><Link href="/Todo/Todo/:id" params={{id: item.id}}>Edit</Link><span onClick={this.removeTodo.bind(this, item)}>[x]</span></wdiv>} else { return <wdiv>[Saving...]</wdiv>;}}.bind(this)()}</li>)}.bind(this))}</ul></div>';
	}

	getFqn(){
		return 'Todo.Todo.ListComponent';
	}

	componentDidMount() {
		super();

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
		return {
			todos: []
		}
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
		Router.goTo('/Todo/Todo/'+item)
	}
}

export default List;
