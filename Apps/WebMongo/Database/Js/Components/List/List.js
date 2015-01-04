import BaseComponent from '/Core/Base/BaseComponent';
import EventManager from '/Core/EventManager';
import DatabaseStore from '/Apps/WebMongo/Database/Js/Stores/DatabaseStore'

class List extends BaseComponent {

	componentDidMount() {
		super();

		// This...
		this.on('WebMongo.Database.DatabaseStore', 'databases');

		// ... is same as ...
		this.on('WebMongo.Database.DatabaseStore', (store) => {
			this.setState({databases: store.getData()});
		});

		// Disable form submission
		var form = this.node('form');
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	getInitialState() {
		return {
			databases: DatabaseStore.getDatabases()
		}
	}

	addDatabase() {
		var databaseInput = this.node('databaseName');
		this.trigger('WebMongo.Database.addDatabaseAction', {name: databaseInput.value});
		databaseInput.value = '';
	}

	removeDatabase(index) {
		this.trigger('WebMongo.Database.removeDatabaseAction', index);
	}

	getTemplate() {

		return '<div className="col-sm-12"> \
					<form ref="form" className="form-inline">\
						<div className="form-group">\
							<input ref="databaseName" type="text" className="form-control" placeholder="New database" />\
							<button type="submit" onClick={this.addDatabase}>Add</button>\
						</div>\
					</form>\
					<ul className="col-sm-11 col-sm-offset-1">\
						<w-loop items={this.state.databases} as="item" index="i">\
							<li>{item.name} <span onClick={this.removeDatabase.bind(this, i)}>[x]</span></li>\
						</w-loop>\
					</ul>\
				</div>';
	}
}

export default List;
