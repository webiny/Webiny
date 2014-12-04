import BaseComponent from '/Core/Base/BaseComponent';

/**
 * Class Layout is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Layout extends BaseComponent {

	getTemplate() {
		return '<div className="component">\
					<br/>\
					<button onClick={this.goTo} data-url="/">Dashboard</button>\
					<button onClick={this.goTo} data-url="/posts">Posts</button>\
					<hr/>\
					<w-placeholder name="MainContent"/>\
				</div>';
	}

	goTo(e) {
		var url = e.target.attributes['data-url'].value;
		console.log("Going to:", url);
		router.navigate(url);
	}
}

var widget = new Layout();
export default widget.getComponent();
