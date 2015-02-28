import BaseComponent from '/Core/Base/BaseComponent';
import EventManager from '/Core/EventManager';

/**
 * Class Layout is the main container that will hold all other components.
 * This component is the first one to render in the <body> element.
 */
class Layout extends BaseComponent {

	getFqn() {
		return 'Core.Layout.LayoutComponent';
	}

	componentDidMount() {
		EventManager.addListener('renderRoute', () => {
			this.setState({
				time: new Date().getTime()
			});
		});
	}
}

export default Layout;
