import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class CopyInput extends Webiny.Ui.FormComponent {
    componentDidMount() {
        super.componentDidMount();

        this.clipboard = new Clipboard(this.refs.button, {
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
}

CopyInput.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    actionLabel: 'Copy',
    onSuccessMessage: 'Copied to clipboard!',
    onCopy: _.noop,
    style: {
        position: 'absolute',
        right: -5,
        zIndex: 100,
        height: 35,
        top: 4,
        lineHeight: 0.5
    },
    renderer() {
        const props = {
            className: 'form-control',
            readOnly: true,
            type: 'text',
            value: this.props.value || '',
            style: {
                paddingRight: 95
            }
        };

        return (
            <div className={this.classSet('form-group', this.props.className)}>
                {this.renderLabel()}
                {this.renderInfo()}
                <div className="input-group">
                    <input {...props}/>
                    <button
                        style={this.props.style}
                        className="btn btn-primary btn--copy"
                        ref="button">
                        {this.props.actionLabel}
                    </button>
                </div>
                {this.renderDescription()}
            </div>
        );
    }
});

export default CopyInput;
