import BaseModule from '/Core/Base/BaseModule'
import ListComponent from '/Apps/Todo/Todo/Js/Components/TaskList/TaskList'
import FormComponent from '/Apps/Todo/Todo/Js/Components/TaskForm/TaskForm'
import TasksStore from '/Apps/Todo/Todo/Js/Stores/TasksStore'

class Todo extends BaseModule {

	registerRoutes() {
		return {
			TodoItemList: {
				Path: '/',
				Content: {
					MasterContent: {
						Component: ListComponent.createComponent(),
						Props: {
							saveState: true
						}
					}
				}
			},
			TodoItemEdit: {
				Path: '/todo/item/:id',
				Content: {
					MasterContent: {
						Component: FormComponent.createComponent()
					}
				}
			}
		};
	}

	registerStores() {
		return [
			TasksStore
		];
	}
}

export default Todo;