import BaseComponent from '/Core/Base/BaseComponent';

class Link extends BaseComponent {

	getFqn(){
		return 'Core.View.Link';
	}
	
	getDynamicProperties(){
		var link = this.props.href;
		var classes = this.props.className;

		if(typeof classes == 'string'){
			classes = classes.split(' ');
			classes.push('w-link');
			classes = classes.join(' ');
		} else if(classes instanceof Object) {
			var cx = React.addons.classSet;
			classes['w-link'] = true;
			classes = cx(classes);
		}
		
		// Build URL
		Object.keys(this.props.params).forEach((param) => {
			link = link.replace(':'+param, this.props.params[param]);
		});
		
		return {
			link: link,
			classes: classes
		}
	}
}

export default Link;
