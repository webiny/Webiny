import BaseComponent from '/Core/Base/BaseComponent';

class Sidebar extends BaseComponent {

	getTemplate() {

		return '<div className="component col-sm-12"> \
					<w-placeholder name="SidebarPlaceholder"/>\
				</div>';
	}
}

export default Sidebar;
