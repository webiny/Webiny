import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class CopyButton extends Webiny.Ui.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: null
        };

        this.timeout = null;

        this.bindMethods('getContent');
    }

    componentDidMount() {
        super.componentDidMount();

        ZeroClipboard.config({swfPath: Webiny.Assets('Core.Webiny', 'other/ZeroClipboard.swf')});
        this.client = new ZeroClipboard(this.refs.button);

        this.client.on('ready', () => {
            this.client.on('aftercopy', event => {
                this.props.onCopy(event);
                this.setState({label: this.props.copied}, () => {
                    this.timeout = setTimeout(() => {
                        this.setState({label: null});
                    }, 2000);
                });
            });
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.client.destroy();
        clearTimeout(this.timeout);
    }

    getContent() {
        let content = this.props.children || this.props.label;
        if (this.state.label) {
            content = this.state.label;
        }

        const icon = this.props.icon ? <Webiny.Ui.Components.Icon icon={this.props.icon} className="right"/> : null;
        if (icon) {
            content = <span>{icon} {content}</span>;
        }

        return content;
    }
}

CopyButton.defaultProps = {
    label: 'Copy',
    copied: 'Copied!',
    onCopy: _.noop,
    renderer() {
        const props = _.clone(this.props);
        props.ref = 'button';


        const sizeClasses = {
            normal: '',
            large: 'btn-lg',
            small: 'btn-sm'
        };

        const alignClasses = {
            normal: '',
            left: 'pull-left',
            right: 'pull-right'
        };

        const typeClasses = {
            default: 'btn-default',
            primary: 'btn-primary',
            secondary: 'btn-success'
        };

        const classes = this.classSet(
            'btn',
            sizeClasses[props.size],
            alignClasses[props.align],
            typeClasses[props.type],
            props.className
        );

        props['data-clipboard-text'] = _.has(this.props, 'value') ? this.props.value || '' : _.get(this.props, 'valueLink.value') || '';

        return <button {...props} type="button" className={classes}>{this.getContent()}</button>;
    }
};

export default CopyButton;
