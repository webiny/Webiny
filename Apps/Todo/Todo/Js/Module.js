import BaseModule from '/Core/Base/BaseModule'
import ListComponent from '/Apps/Todo/Todo/Js/Components/List/List'
import TodoStore from '/Apps/Todo/Todo/Js/Stores/TodoStore'

class Todo extends BaseModule {

	registerRoutes() {

		var todoList = ListComponent.createInstance();
		return {
			'/': {
				MainContent: {
					component: todoList
				}
			}
		}
	}

	registerStores() {
		return [
			TodoStore
		];
	}
}

export default Todo;