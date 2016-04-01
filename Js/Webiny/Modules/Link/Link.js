import Webiny from 'Webiny';

class Link extends Webiny.Ui.Component {

    render() {
        const props = _.clone(this.props);

        props.href = null;

        if (!props.disabled) {
            if (props.url) {
                props.href = props.url;
            } else if (props.route) {
                let route = props.route;
                if (_.isString(route)) {
                    route = route === 'current' ? Webiny.Router.getActiveRoute() : Webiny.Router.getRoute(route);
                }
                props.href = route === null ? '#' : route.getHref(props.params, null, this.props.merge);
            }
        }

        if (props.separate) {
            props.target = '_blank';
        }

        const sizeClasses = {
            normal: '',
            large: 'btn-lg',
            small: 'btn-sm'
        };

        const classes = {};
        if (this.props.className) {
            classes[this.props.className] = true;
        }
        classes.btn = this.props.type || this.props.size;
        if (this.props.type) {
            classes['btn'] = true;
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
