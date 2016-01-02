import Dispatcher from './../../../Lib/Core/Dispatcher';
import Router from './../../../Lib/Router/Router';
import Component from './../../../Lib/Core/Component';

class Placeholder extends Component {

	constructor(){
		super();
	}

	componentDidMount() {
        if(this.props.onDidUpdate){
			this.props.onDidUpdate();
		}
	}

	render() {
        if (!Router.getActiveRoute()) {
			return false;
		}

		var route = Router.getActiveRoute();
		var components = route.getComponents(this.props.name);

        var defComponents = [];
		if(!route.skipDefaultComponents()){
			defComponents = Router.getDefaultComponents(this.props.name);
		}

		var render = [];
		_.compact(components.concat(defComponents)).forEach((item, index) => {
			var props = {key: index};
			if(!_.isFunction(item)){
				_.assign(props, item[1]);
				item = item[0];
			}
			render.push(React.createElement(item, props));
		});
		
		if (!render.length) {
			return false;
		}

		return <rad-placeholder>{render}</rad-placeholder>;
	}

	componentDidUpdate(){
		if(this.props.onDidUpdate){
			this.props.onDidUpdate();
		}
	}
}

export default Placeholder;
