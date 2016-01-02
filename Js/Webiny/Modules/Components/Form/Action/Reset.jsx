import Component from './../../../Core/Core/Component';

class Reset extends Component {

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
            sizeClasses[this.props.size]
        );

        var props = this.props;
        if (!this.enabled) {
            props['disabled'] = true;
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

Reset.defaultProps = {
    type: 'default',
    size: 'normal',
    className: 'btn btn-default pull-right mr10'
};

export default Reset;