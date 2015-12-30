import Component from './../../Lib/Component';

class Dialog extends Component {

    render() {
        var backdrop = this.props.closeOnClick ? true : 'static';

        var className = _.isObject(this.props.className) ? this.props.className.dialog : this.props.className;

        var dialogProps = {
            className: this.classSet('modal fade', className),
            'data-backdrop': backdrop,
            onShown: this.props.onShown,
            onHidden: this.props.onHidden,
            onShow: this.props.onShow,
            onHide: this.props.onHide
        };

        var contentClassName = _.isObject(this.props.className) ? this.props.className.content : 'modal-content panel-content';

        var dialog = (
            <div {...dialogProps} tabIndex="-1">
                <div className="modal-dialog" style={this.props.style}>
                    <div className={contentClassName}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );

        this.trigger('Webiny.Components.Modal.Create', dialog);

        return null;
    }
}

Dialog.defaultProps = {
    closeOnClick: true,
    onShown: _.noop,
    onHidden: _.noop,
    onShow: _.noop,
    onHide: _.noop,
	style: {}
};

export default Dialog;