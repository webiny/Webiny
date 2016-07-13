import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import CopyButton from './CopyButton';

class CopyInput extends CopyButton {

}

CopyInput.defaultProps = {
    copy: 'Copy',
    copied: 'Copied!',
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
            value: _.has(this.props, 'value') ? this.props.value || '' : _.get(this.props, 'valueLink.value') || '',
            style: {
                paddingRight: 95
            }
        };

        return (
            <div className={this.classSet('form-group', this.props.className)}>
                {label}
                <span className="info-text">{info}</span>

                <div className="input-group">
                    <input {...props}/>
                    <button
                        style={this.props.style}
                        className="btn btn-primary"
                        ref="button"
                        data-clipboard-text={props.value}>
                        {this.state.label || this.props.copy}
                    </button>
                </div>
                <span className="help-block">{description}</span>
            </div>
        );
    }
};

export default CopyInput;
