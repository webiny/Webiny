import Component from './../../Lib/Component';
import Router from './../../Lib/Router/Router';

class Link extends Component {

	render() {
		var props = _.clone(this.props);


        props.href = 'javascript:';

		if (!props.disabled) {
			if (props.url) {
				props.href = props.url;
			} else if (props.route) {

				var route = props.route;
				if(_.isString(route)) {
					route = route == 'current' ? Router.getActiveRoute() : Router.getRoute(route);
				}
				props.href = route.getHref(props.params, null, this.props.merge);
			}
		}

        if (props.separate) {
            props.target = '_blank';
        }

		var sizeClasses = {
			normal: '',
			large: 'btn-lg',
			small: 'btn-sm'
		};

		var classes = {};
		if(this.props.className){
			classes[this.props.className] = true;
		}
		classes['btn'] = this.props.type || this.props.size;
		if (this.props.type) {
			classes['btn-' + this.props.type] = true;
		}

		if (this.props.size) {
			classes[sizeClasses[this.props.size]] = true;
		}

        return <a {...props} className={this.classSet(classes)}>{this.props.children}</a>;
	}
}

Link.defaultProps = {
	type: null,
	size: null,
	merge: true
};

export default Link;