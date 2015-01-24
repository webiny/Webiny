import BaseComponent from '/Core/Base/BaseComponent';

class Link extends BaseComponent {

	getTemplate(){ return '<a href={this.dynamic.link}>{this.props.children}</a>';
	}

	getFqn(){
		return 'Core.View.Link';
	}
	
	getDynamicProperties(){
		var link = this.props.href;
		Object.keys(this.props.params).forEach((param) => {
			link = link.replace(':'+param, this.props.params[param]);
		});
		
		return {
			link: link
		}
	}
}

export default Link;
