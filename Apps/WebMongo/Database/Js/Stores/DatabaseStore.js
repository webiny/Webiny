import BaseStore from '/Core/Base/BaseStore';

class DatabaseStore extends BaseStore {

	getFqn(){
		return 'WebMongo.Database.DatabaseStore';
	}

	init() {
		this.data = [
			{name: 'Webiny Sandbox'},
			{name: 'Webiny Production'},
			{name: 'Webiny Development'}
		];

		this.onAction('WebMongo.Database.addDatabaseAction', (database) => {
			this.data.push(database);
			this.emitChange();
		});

		this.onAction('WebMongo.Database.removeDatabaseAction', (index) => {
			this.data.splice(index, 1);
			this.emitChange();
		});
	}

	getDatabases() {
		return this.data;
	}
}

export default DatabaseStore;