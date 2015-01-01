import BaseModule from '/Core/Base/BaseModule'
import ListComponent from '/Apps/WebMongo/Database/Js/Components/List/List'
import DatabaseStore from '/Apps/WebMongo/Database/Js/Stores/DatabaseStore'

class Database extends BaseModule {

	registerRoutes() {
		return {
			'*': {
				'SidebarPlaceholder': {
					component: ListComponent.createInstance()
				}
			}
		}
	}
}

export default Database;