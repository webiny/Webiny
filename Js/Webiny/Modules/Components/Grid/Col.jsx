import Component from './../../Core/Core/Component';

var propsMap = {
	xs: 'xs',
	xsOffset: 'xs-offset',
	xsPull: 'xs-pull',
	xsPush: 'xs-push',
	sm: 'sm',
	smOffset: 'sm-offset',
	smPull: 'sm-pull',
	smPush: 'sm-push',
	md: 'md',
	mdOffset: 'md-offset',
	mdPull: 'md-pull',
	mdPush: 'md-push',
	lg: 'lg',
	lgOffset: 'lg-offset',
	lgPull: 'lg-pull',
	lgPush: 'lg-push'
};

function getCssClass(key, val) {
	if (key == 'all') {
		return `${getCssClass('xs', val)}`;
	}
	return _.has(propsMap, key) ? `col-${propsMap[key]}-${val}` : false;
}

class Col extends Component {

	render() {

		var props = _.clone(this.props);
		var cssClasses = [];

		var cls = _.trim(props.className);
		if (cls != '') {
			cssClasses = cls.split(' ');
		}
		delete props['className'];

		_.forEach(props, (cssClass, key) => {
			var cls = getCssClass(key, cssClass);
			if (cls) {
				cssClasses.push(cls);
			}
		});

		return <div {...this.props} className={this.classSet(cssClasses)}/>;
	}
}

Col.defaultProps = {
	className: ''
};

export default Col;
