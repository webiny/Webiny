import Webiny from 'Webiny';
import Downloader from './../Downloader/Downloader';

class Link extends Webiny.Ui.Component {

}

Link.defaultProps = {
    type: null,
    size: null,
    merge: true,
    url: null,
    title: '',
    route: null,
    download: null,
    data: null,
    params: {},
    separate: false,
    className: '',
    renderer() {
        const props = _.clone(this.props);

        props.href = 'javascript:void(0)';

        if (!props.disabled) {
            if (props.url) {
                // Let's ensure we have at least http:// specified - for cases where users just type www...
                if (!/^(f|ht)tps?:\/\//i.test(props.url)) {
                    props.url = 'http://' + props.url;
                }
                props.href = props.url;
            } else if (props.route) {
                let route = props.route;
                if (_.isString(route)) {
                    route = route === 'current' ? Webiny.Router.getActiveRoute() : Webiny.Router.getRoute(route);
                }
                props.href = route === null ? 'javascript:void(0)' : route.getHref(props.params, null, this.props.merge);
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

        /**
         * If downloader is used, handle URL or a custom function
         */
        let downloader = null;
        if (props.download) {
            downloader = <Downloader ref="downloader"/>;
            props.onClick = () => {
                if (_.isString(this.props.download)) {
                    this.refs.downloader.download('GET', this.props.download);
                } else {
                    this.props.download(this.refs.downloader.download, this.props.data || null);
                }
            };
            delete props['download'];
        }

        return (
            <a {...props} className={this.classSet(classes)}>
                {this.props.children}
                {downloader}
            </a>
        );
    }
};

export default Link;
