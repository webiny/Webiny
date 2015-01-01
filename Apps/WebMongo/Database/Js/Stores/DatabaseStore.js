import BaseStore from '/Core/Base/BaseStore';

class DatabaseStore extends BaseStore {

	// @TODO: component unmount should remove listeners
	// @TODO: store INIT() should be called when store is first used...

	getFQN(){
		return 'WebMongo.Database.DatabaseStore';
	}

	init() {
		this.data = [
			{name: 'Webiny Sandbox'},
			{name: 'Webiny Production'},
			{name: 'Webiny Development'}
		];

		this.on('WebMongo.Database.addDatabaseAction', (database) => {
			this.data.push(database);
			this.emitChange();
		});

		this.on('WebMongo.Database.removeDatabaseAction', (index) => {
			this.data.splice(index, 1);
			this.emitChange();
		});

		/**
		 * Example of listening for other store changes
		 * NOT YET IMPLEMENTED
		 */
		this.on('WebMongo.Database.CollectionStore', (store) => {
			// Do something with CollectionStore data
		});
	}
}

var store = new DatabaseStore;
store.init();
export default store;