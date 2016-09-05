import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class CopyButton extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('getContent,getTarget');
    }

    componentDidMount() {
        super.componentDidMount();

        this.clipboard = new Clipboard(this.getTarget(), {
            text: () => {
                return this.props.value;
            }
        });

        this.clipboard.on('success', () => {
            const onSuccessMessage = this.props.onSuccessMessage;
            if (_.isFunction(onSuccessMessage)) {
                onSuccessMessage();
            } else if (_.isString(onSuccessMessage)) {
                Webiny.Growl.info(onSuccessMessage);
            }
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.clipboard.destroy();
    }

    getTarget() {
        return ReactDOM.findDOMNode(this);
    }

    getContent() {
        let content = this.props.children || this.props.label;

        const icon = this.props.icon ? <Webiny.Ui.Components.Icon icon={this.props.icon} className="right"/> : null;
        if (icon) {
            content = <span>{icon} {content}</span>;
        }

        return content;
    }
}

CopyButton.defaultProps = {
    label: 'Copy',
    onSuccessMessage: 'Copied to clipboard!',
    onCopy: _.noop,
    style: null,
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

        const text = _.has(this.props, 'value') ? this.props.value || '' : _.get(this.props, 'valueLink.value') || '';

        return <button style={this.props.style} data-clipboard-text={text} type="button" className={classes}>{this.getContent()}</button>;
    }
};

export default CopyButton;
