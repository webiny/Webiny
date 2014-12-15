import BaseComponent from '/Core/Base/BaseComponent';

class Sidebar extends BaseComponent {

	getInitialState(){
		return {
			databases: [
				{name: 'Webiny Sandbox'},
				{name: 'Webiny Development'},
				{name: 'Webiny Production'}
			]
		}
	}

	getTemplate() {
		return '<div className="component col-sm-12"> \
					<h4>WebMongo-Layout-Sidebar</h4> \
					<ul className="col-sm-11 col-sm-offset-1">\
						<w-loop items={this.state.databases} as="item" index="i">\
							<li>{item.name}</li>\
						</w-loop>\
					</ul>\
				</div>';
	}
}

export default Sidebar;
