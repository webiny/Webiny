import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

let currentModal = null;

class Dialog extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShown: false
        };

        this.clickStartedOnBackdrop = false;
        if (!document.querySelector(props.modalContainerTag)) {
            document.body.appendChild(document.createElement(props.modalContainerTag));
        }

        this.modalContainer = document.querySelector(props.modalContainerTag);

        this.bindMethods('show,hide,bindHandlers,unbindHandlers,prepareChildren,prepareChild');
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.state.isShown) {
            ReactDOM.render(this.props.renderDialog.call(this), this.modalContainer);
            $(this.modalContainer).find('.modal').focus();
            this.bindHandlers();
        } else {
            this.unbindHandlers();
            ReactDOM.unmountComponentAtNode(this.modalContainer);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unbindHandlers();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
    }

    bindHandlers() {
        $(this.props.modalContainerTag).on('keyup.modal', '.modal', e => {
            // Listen for ESC button
            if (e.keyCode === 27) {
                this.hide();
            }
        }).on('mousedown.modal', '.modal', e => {
            // Catch backdrop click
            if ($(e.target).hasClass('modal')) {
                this.clickStartedOnBackdrop = true;
            }
        }).on('click.modal', '.modal', () => {
            if (this.clickStartedOnBackdrop && this.props.closeOnClick) {
                this.hide();
            }
            this.clickStartedOnBackdrop = false;
        });
    }

    unbindHandlers() {
        $(this.props.modalContainerTag).off('.modal');
    }

    hide(callback) {
        this.props.onHide();
        this.setState({
            isShown: false
        }, () => {
            this.props.onHidden();
            if (_.isFunction(callback)) {
                callback();
            }
        });
        currentModal = null;
    }

    show() {
        const show = () => {
            this.props.onShow();
            this.setState({
                isShown: true
            }, () => {
                this.props.onShown();
            });
            currentModal = this;
        };

        if (currentModal) {
            currentModal.hide(show);
        } else {
            show();
        }
    }

    prepareChild(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        if (child.type === Ui.Modal.Header) {
            return React.cloneElement(child, {onClose: this.hide});
        }

        return child;
    }

    prepareChildren(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.prepareChild);
    }
}

Dialog.defaultProps = {
    wide: false,
    onHide: _.noop,
    onHidden: _.noop,
    onShow: _.noop,
    onShown: _.noop,
    closeOnClick: true,
    modalContainerTag: 'webiny-modal',
    renderDialog() {
        const className = this.classSet({modal: true, 'modal-wizard': this.props.wide});
        return (
            <div style={{display: 'block'}}>
                <div className="modal-backdrop in"></div>
                <div className={className} tabIndex="-1" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            {this.prepareChildren(this.props.children)}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    renderer() {
        return null;
    }
};

export default Dialog;