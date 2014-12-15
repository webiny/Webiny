import BaseComponent from '/Core/Base/BaseComponent';
import ContentComponent from '/Apps/WebMongo/Layout/Js/Components/Content/Content';

class Layout extends BaseComponent {

	getComponents() {
		return {
			WebMongoContent: ContentComponent.createInstance()
		}
	}

	getTemplate() {
		return '<div className="component row">\
					<h4 className="col-sm-12">WebMongo-Layout-Layout</h4> \
					<div className="col-sm-4">\
						<w-placeholder name="WebMongoSidebar"/>\
					</div>\
					<div className="col-sm-8">\
						<WebMongoContent title={this.props.title} count={this.props.count}>\
							A database grid should be displayed here!\
						</WebMongoContent> \
					</div>\
				</div>';
	}
}

export default Layout;
