import BaseComponent from '/Core/Base/BaseComponent';
import EventManager from '/Core/EventManager';

/**
 * Class Layout is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Layout extends BaseComponent {

	componentDidMount() {
		EventManager.addListener('renderRoute', () => {
			this.setState({
				time: new Date().getTime()
			});
		});
	}

	getTemplate() {
		return '<div className="component container">\
					<h4>Core-View-Layout</h4>\
					<button onClick={this.goTo} data-url="/">Dashboard</button>\
					<button onClick={this.goTo} data-url="/posts">Posts</button>\
					<hr/>\
					<w-placeholder name="MainContent"/>\
				</div>';
	}

	goTo(e) {
		var url = e.target.attributes['data-url'].value;
		router.navigate(url);
	}
}

export default Layout;
