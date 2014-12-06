import BaseComponent from 'Core/Base/BaseComponent';
import EventManager from 'Core/EventManager';

class Master extends BaseComponent {

	constructor() {
		this.components = {};
	}

	componentDidMount() {
		EventManager.addListener('renderRoute', () => {
			this.setState({
				time: new Date().getTime()
			});
		});
	}

	getTemplate() {
		console.info('MASTER GET TEMPLATE')
		var template = '<div className="container">\
							<div className="col-sm-12 placeholder-container">[[Header]]</div>\
							<div className="col-sm-3 placeholder-container"><w-placeholder name="LeftSidebar"/></div>\
							<div className="col-sm-6 placeholder-container"><w-placeholder name="Content"/></div>\
							<div className="col-sm-3 placeholder-container"><w-placeholder name="RightSidebar"/></div>\
							<div className="col-sm-12 placeholder-container">[[Footer]]</div>\
						</div>';

		return template;
	}

	runApp() {
		router.start();
	}
}

var widget = new Master();
export default widget.getComponent();