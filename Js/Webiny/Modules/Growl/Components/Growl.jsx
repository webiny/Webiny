import Webiny from 'Webiny';

class Growl extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('close');
    }

    componentDidMount() {
        if (!this.props.sticky) {
            this.closeDelay = setTimeout(() => {
                this.close();
            }, this.props.ttl || 3000);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearTimeout(this.closeDelay);
        this.closeDelay = null;
    }

    close() {
        this.props.onRemove(this);
    }
}

Growl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    renderer() {
        const classes = this.classSet('growl-notification', this.props.className);
        const title = this.props.title ? <div className="growl-header">{this.props.title}</div> : null;
        let messages = [];
        if (this.props.message) {
            messages.push(this.props.message);
        }

        if (this.props.children) {
            messages = React.Children.toArray(this.props.children);
        }

        return (
            <div className={classes} style={{display: 'block'}}>
                <div className="growl-close" onClick={this.close}>x</div>
                {title}
                {messages.map((msg, i) => {
                    return <div key={i} className="growl-message">{msg}</div>;
                })}
            </div>
        );
    }
};

export default Growl;