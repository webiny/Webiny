import BaseComponent from '/Core/Base/BaseComponent';
import DatabaseStore from '/Apps/WebMongo/Database/Js/Stores/DatabaseStore'

class List extends BaseComponent {

	componentDidMount() {

		/**
		 * Listen for data store updates
		 */
		this.on('WebMongo.Database.DatabaseStore', (data) => {
			this.setState({databases: data});
		});


		/**
		 * Disable form submission
		 */
		var form = this.refs.form.getDOMNode();
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}

	getInitialState() {
		return {
			databases: DatabaseStore.data
		}

	}

	addDatabase() {
		var databaseInput = this.refs.databaseName.getDOMNode();
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
