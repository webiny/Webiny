import Webiny from 'Webiny';

class Link extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('getLinkProps');
    }

    getLinkProps() {
        const props = _.clone(this.props);

        props.href = 'javascript:void(0)';

        if (!props.disabled) {
            if (props.url) {
                // Let's ensure we have at least http:// specified - for cases where users just type www...
                if (!/^(f|ht)tps?:\/\//i.test(props.url) && !props.url.startsWith('/')) {
                    props.url = 'http://' + props.url;
                }
                props.href = props.url;
            } else if (props.route) {
                let route = props.route;
                if (_.isString(route)) {
                    route = route === 'current' ? Webiny.Router.getActiveRoute() : Webiny.Router.getRoute(route);
                }
                if (route === null) {
                    props.href = 'javascript:void(0)';
                } else {
                    props.href = route.getHref(props.params, null);
                    if (props.href.startsWith('//')) {
                        props.href = props.href.substring(1); // Get everything after first character (after first slash)
                    }
                }
            }
        }

        if (props.separate) {
            props.target = '_blank';
        }

        const typeClasses = {
            default: 'btn-default',
            primary: 'btn-primary',
            secondary: 'btn-success'
        };

        const alignClasses = {
            normal: '',
            left: 'pull-left',
            right: 'pull-right'
        };

        const sizeClasses = {
            normal: '',
            large: 'btn-lg',
            small: 'btn-sm'
        };

        const classes = {};

        classes.btn = this.props.type || this.props.size;
        if (this.props.type) {
            classes[typeClasses[this.props.type]] = true;
        }

        if (this.props.size) {
            classes[sizeClasses[this.props.size]] = true;
        }

        if (this.props.align) {
            classes[alignClasses[props.align]] = true;
        }

        if (this.props.className) {
            classes[this.props.className] = true;
        }

        props.className = this.classSet(classes);

        if (props.preventScroll) {
            props['data-prevent-scroll'] = true;
        }

        return _.pick(props, ['className', 'style', 'target', 'href', 'onClick', 'data-prevent-scroll']);
    }
}

Link.defaultProps = {
    type: null,
    size: null,
    url: null,
    title: '',
    route: null,
    preventScroll: false,
    data: null,
    params: {},
    separate: false,
    className: '',
    renderer() {
        return (
            <a {...this.getLinkProps()}>{this.props.children}</a>
        );
    }
};

export default Link;
