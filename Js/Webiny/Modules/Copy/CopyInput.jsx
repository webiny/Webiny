import CopyButton from './CopyButton';

class CopyInput extends CopyButton {
    getTarget() {
        return this.refs.button;
    }
}

CopyInput.defaultProps = {
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
        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        let info = this.props.info;
        if (_.isFunction(info)) {
            info = info(this);
        }

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
                {label}
                <span className="info-txt">{info}</span>

                <div className="input-group">
                    <input {...props}/>
                    <button
                        style={this.props.style}
                        className="btn btn-primary btn--copy"
                        ref="button">
                        {this.props.actionLabel}
                    </button>
                </div>
                <span className="help-block">{description}</span>
            </div>
        );
    }
};

export default CopyInput;
