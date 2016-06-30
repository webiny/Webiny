import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

const mountedDialogs = [];

function getShownDialog(id = null) {
    return _.find(mountedDialogs, item => item.state.isShown === true && item.id !== id);
}


class Dialog extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('modal-dialog-');

        this.state = {
            isShown: false,
            isDialogShown: false
        };

        this.clickStartedOnBackdrop = false;
        if (!document.querySelector(props.modalContainerTag)) {
            document.body.appendChild(document.createElement(props.modalContainerTag));
        }

        this.modalContainer = document.querySelector(props.modalContainerTag);

        this.bindMethods('show,hide,bindHandlers,unbindHandlers,prepareChildren,prepareChild,animationFinish');
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        const currentDialog = getShownDialog();
        if (currentDialog && currentDialog.id !== this.id && nextState.isShown) {
            $(currentDialog.modalContainer).hide();
        }


        if (!nextState.isShown) {
            const prevDialog = getShownDialog(this.id);
            if (prevDialog) {
                $(prevDialog.modalContainer).show();
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.isShown()) {
            $(this.modalContainer).show();
            ReactDOM.render(this.props.renderDialog.call(this), this.modalContainer);
            $(this.modalContainer).find('.modal').focus();
            this.bindHandlers();
        } else if (prevState.isShown && !this.isShown()) {
            this.unbindHandlers();
            ReactDOM.unmountComponentAtNode(this.modalContainer);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        mountedDialogs.push(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unbindHandlers();
        mountedDialogs.splice(_.findIndex(mountedDialogs, {id: this.id}), 1);
        ReactDOM.unmountComponentAtNode(this.modalContainer);
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

    hide() {
        if (!this.state.isShown) {
            return Q(true);
        }
        this.props.onHide();

        return new Promise(resolve => {
            this.hideResolve = resolve;
            this.setState({
                isDialogShown: false
            });
        });
    }

    show() {
        // This shows the modal container element in case it was previously hidden by another dialog
        $(this.modalContainer).show();

        this.props.onShow();

        return new Promise(resolve => {
            this.setState({
                isShown: true
            }, () => {
                this.setState({
                    isDialogShown: true
                }, () => {
                    this.props.onShown();
                    resolve();
                });
            });
        });
    }

    isShown() {
        return this.state.isShown;
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

    animationFinish(isDialogShown) {
        if (!isDialogShown) {
            this.setState({isShown: false}, this.props.onHidden);
        }
        this.hideResolve();
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
    style: {},
    renderDialog() {
        const className = this.classSet({modal: true, 'modal-wizard': this.props.wide});
        return (
            <div style={_.merge({}, {display: 'block'}, this.props.style)}>

                <Ui.Animate trigger={this.state.isDialogShown} show={{opacity: 0.8, duration: 100}}>
                    <div className="modal-backdrop"></div>
                </Ui.Animate>

                <div className={className} tabIndex="-1" style={{display: 'block'}}>
                    <Ui.Animate
                        trigger={this.state.isDialogShown}
                        onFinish={this.animationFinish}
                        show={{translateY: 50, ease: 'spring', duration: 800}}
                        hide={{translateY: -100, ease: 'easeOut', opacity: 0, duration: 250}}>
                        <div className={this.classSet('modal-dialog modal-show', this.props.className)} style={{top: -50}}>
                            <div className="modal-content">
                                {this.prepareChildren(this.props.children)}
                            </div>
                        </div>
                    </Ui.Animate>
                </div>
            </div>

        );
    },
    renderer() {
        return null;
    }
};

export default Dialog;