import BaseStore from '/Core/Base/BaseStore';

class CollectionStore extends BaseStore {

	getFqn(){
		return 'WebMongo.Database.CollectionStore';
	}

	init() {
		this.onAction('WebMongo.Database.addDatabaseAction', (database) => {
			this.emitChange();
		});

		this.onAction('WebMongo.Database.removeDatabaseAction', (index) => {
			this.emitChange();
		});
	}
}

export default CollectionStore;