import Component from './../../Core/Core/Component';

class Button extends Component {

    render() {
		var sizeClasses = {
			normal: '',
			large: 'btn-lg',
			small: 'btn-sm'
		};

        var classes = this.classSet(
			'btn btn-' + this.props.type,
			this.props.className,
			sizeClasses[this.props.size]
		);
        return <button {... this.props} type="button" className={classes}>{this.props.children}</button>;
    }
}

Button.defaultProps = {
    type: 'default',
	size: 'normal'
};

export default Button;