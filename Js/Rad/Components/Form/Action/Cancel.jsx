import Component from './../../../Lib/Component';

class Cancel extends Component {

    constructor() {
        super();

        this.enabled = true;
    }

    render() {
        var sizeClasses = {
            normal: '',
            large: 'btn-lg',
            small: 'btn-sm'
        };

        var classes = this.classSet(
            this.props.className,
            sizeClasses[this.props.size],
			this.props.addClassName
        );

        var props = _.clone(this.props);
        if (!this.enabled) {
            props['disabled'] = true;
        }

		if(this.props.route){
			props.onClick = () => {
				Rad.Router.goToRoute(this.props.route);
			};
		}

        return <button {...props} className={classes} type="button">
            {this.props.children ? this.props.children : this.props.label}
        </button>;
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }
}

Cancel.defaultProps = {
    type: 'default',
    size: 'normal',
    className: 'btn btn-light-gray pull-right mr10',
	addClassName: null,
	route: null
};

export default Cancel;