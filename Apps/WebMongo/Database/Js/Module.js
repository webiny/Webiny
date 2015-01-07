import BaseModule from '/Core/Base/BaseModule'
import ListComponent from '/Apps/WebMongo/Database/Js/Components/List/List'
import DatabaseStore from '/Apps/WebMongo/Database/Js/Stores/DatabaseStore'

class Database extends BaseModule {

	registerRoutes() {

		var databaseList = ListComponent.createInstance();
		return {
			'/': {
				'SidebarPlaceholder': {
					component: databaseList
				}
			},

			'/posts': {
				'ContentPlaceholder': {
					component: databaseList
				}
			}
		}
	}

	registerStores(){
		return {
			'WebMongo.Database.DatabaseStore': DatabaseStore
		}
	}
}

export default Database;