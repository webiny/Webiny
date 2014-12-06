import BaseModule from '/Core/Base/BaseModule'
import LayoutComponent from '/Apps/WebMongo/Layout/Js/Components/Layout/Layout'
import SidebarComponent from '/Apps/WebMongo/Layout/Js/Components/Sidebar/Sidebar'
import ContentComponent from '/Apps/WebMongo/Layout/Js/Components/Content/Content'

class Layout extends BaseModule{

	registerRoutes() {
		return {
			'*': {
				MainContent: {
					component: LayoutComponent.createInstance()
				},
				'WebMongoSidebar': {
					component: SidebarComponent.createInstance()
				}
			}
		}
	}
}

export default Layout;