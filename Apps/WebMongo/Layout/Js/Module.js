import BaseModule from '/Core/Base/BaseModule'
import LayoutComponent from '/Apps/WebMongo/Layout/Js/Components/Layout/Layout'
import SidebarComponent from '/Apps/WebMongo/Layout/Js/Components/Sidebar/Sidebar'
import ContentComponent from '/Apps/WebMongo/Layout/Js/Components/Content/Content'

class Layout extends BaseModule {

	registerRoutes() {
		var layoutComponent = LayoutComponent.createInstance();

		return {
			'*': {
				'WebMongoSidebar': {
					component: SidebarComponent.createInstance()
				}
			},
			'/': {
				MainContent: {
					component: layoutComponent
				}
			},
			'/posts': {
				MainContent: {
					component: layoutComponent,
					params: {
						title: 'Pavel',
						count: 3
					}
				}
			}
		}
	}
}

export default Layout;