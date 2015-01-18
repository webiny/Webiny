import BaseComponent from '/Core/Base/BaseComponent';
import EventManager from '/Core/EventManager';

/**
 * Class Layout is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Layout extends BaseComponent {

	getFqn(){
		return 'Core.View.LayoutComponent';
	}

	componentDidMount() {
		EventManager.addListener('renderRoute', () => {
			this.setState({
				time: new Date().getTime()
			});
		});
	}

	goTo(e) {
		var url = e.target.attributes['data-url'].value;
		router.navigate(url);
	}
}

export default Layout;
