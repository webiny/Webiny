import BaseComponent from '/Core/Base/BaseComponent';

class Sidebar extends BaseComponent {

	getTemplate() {
		return '<div className="component col-sm-12"> \
					<h4>WebMongo-Layout-Sidebar</h4> \
					<ul className="col-sm-11 col-sm-offset-1">\
						<li>Database 1</li>\
						<li>Database 2</li>\
					</ul>\
				</div>';
	}
}

export default Sidebar;
