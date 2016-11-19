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

        this.modalShowDuration = 800;
        this.modalHideDuration = 250;
        this.backdropShowDuration = 100;
        this.backdropHideDuration = 200;

        this.animating = false;
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

        // Hide currently visible dialog but do not unmount it
        if (currentDialog && currentDialog.id !== this.id && nextState.isShown) {
            const container = $(currentDialog.modalContainer);
            const modal = container.find('.modal-dialog');
            const backdrop = container.find('.modal-backdrop');

            dynamics.animate(modal[0], {
                opacity: 0,
                translateY: -100
            }, {
                type: dynamics.easeOut,
                duration: this.modalHideDuration,
                complete: () => {
                    // Need to hide .modal to let mouse events through
                    modal.closest('.modal').hide();
                    // Remove transform so next time we animate, we start from scratch, with no transformations applied
                    modal.css('transform', '');
                }
            });

            dynamics.animate(backdrop[0], {
                opacity: 0
            }, {
                type: dynamics.easeOut,
                duration: this.backdropHideDuration
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.isShown()) {
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
        this.unbindHandlers();
        const namespace = '.' + this.id;
        $(this.props.modalContainerTag).on('keyup' + namespace, '.modal', e => {
            // Listen for ESC button
            if (e.keyCode === 27 && !this.animating && this.props.closeOnClick) {
                Q(this.props.onCancel()).then(this.hide);
            }
        }).on('mousedown' + namespace, '.modal', e => {
            // Catch backdrop click
            if ($(e.target).hasClass('modal')) {
                this.clickStartedOnBackdrop = true;
            }
        }).on('click' + namespace, '.modal', () => {
            if (this.clickStartedOnBackdrop && this.props.closeOnClick) {
                Q(this.props.onCancel()).then(this.hide);
            }
            this.clickStartedOnBackdrop = false;
        });
    }

    unbindHandlers() {
        $(this.props.modalContainerTag).off('.' + this.id);
    }

    hide() {
        if (!this.state.isDialogShown || this.animating) {
            return Q(true);
        }

        this.animating = true;
        return Q(this.props.onHide()).then(() => {
            return new Promise(resolve => {
                this.hideResolve = resolve;
                this.setState({
                    isDialogShown: false
                });
            });
        });
    }

    show() {
        // This shows the modal container element in case it was previously hidden by another dialog
        this.props.onShow();

        if (this.isShown()) {
            // Animate previously hidden dialog
            return new Promise(resolve => {
                this.animating = true;
                const prevContainer = $(this.modalContainer);
                const prevModal = prevContainer.find('.modal-dialog');
                const prevBackdrop = prevContainer.find('.modal-backdrop');
                prevModal.closest('.modal').show();
                dynamics.animate(prevModal[0], {
                    opacity: 1,
                    translateY: 50
                }, {
                    type: dynamics.spring,
                    duration: this.modalShowDuration,
                    complete: () => {
                        prevModal.closest('.modal').focus();
                        this.animating = false;
                        resolve();
                    }
                });

                dynamics.animate(prevBackdrop[0], {
                    opacity: 0.8
                }, {
                    type: dynamics.easeIn,
                    duration: this.backdropShowDuration
                });
            });
        }

        return new Promise(resolve => {
            // If showing previously visually hidden modal - resolve promise
            if (this.isShown()) {
                return resolve();
            }

            this.setState({
                isShown: true
            }, () => {
                // Now we are supposed to show dialog with animation
                this.animating = true;
                const show = () => {
                    this.setState({
                        isDialogShown: true
                    }, () => {
                        this.props.onShown();
                        resolve();
                    });
                };

                // If there was a previous dialog (eg: hidden with ClickConfirm), let the animation finish and show new dialog with delay
                if (getShownDialog(this.id)) {
                    setTimeout(show, 250);
                } else {
                    // No previous dialog was opened - we can safely show our new dialog
                    show();
                }
            });
        });
    }

    isShown() {
        return this.state.isShown;
    }

    isAnimating() {
        return this.animating;
    }

    prepareChild(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        if ([Ui.Modal.Header, Ui.Modal.Body, Ui.Modal.Footer].indexOf(child.type) > -1) {
            const props = {dialog: this};
            if (child.type === Ui.Modal.Header) {
                props['onClose'] = this.hide;
            }
            return React.cloneElement(child, props);
        }

        if (child.props.children) {
            return React.cloneElement(child, _.omit(child.props, ['ref', 'key']), this.prepareChildren(child.props.children));
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
        this.animating = false;
        if (!isDialogShown) {
            this.setState({isShown: false}, this.props.onHidden);
            this.hideResolve();
        }
    }
}

Dialog.defaultProps = {
    wide: false,
    onHide: _.noop,
    onHidden: _.noop,
    onShow: _.noop,
    onShown: _.noop,
    onCancel: _.noop, // Called when dialog is closed using ESC or backdrop click
    closeOnClick: true,
    modalContainerTag: 'webiny-modal',
    style: {},
    renderDialog() {
        const className = this.classSet({modal: true, 'modal-wizard': this.props.wide});
        let content = this.props.children;
        if (_.isFunction(content)) {
            content = content.call(this, this);
        }
        return (
            <div style={_.merge({}, {display: 'block'}, this.props.style)}>

                <Ui.Animate
                    trigger={this.state.isDialogShown}
                    show={{opacity: 0.8, duration: this.backdropShowDuration, ease: 'easeIn'}}
                    hide={{opacity: 0, duration: this.backdropHideDuration, ease: 'easeOut'}}>
                    <div className="modal-backdrop" style={{opacity: 0}}></div>
                </Ui.Animate>

                <div className={className} tabIndex="-1" style={{display: 'block'}}>
                    <Ui.Animate
                        trigger={this.state.isDialogShown}
                        onFinish={this.animationFinish}
                        show={{translateY: 50, ease: 'spring', duration: this.modalShowDuration}}
                        hide={{translateY: -100, ease: 'easeOut', opacity: 0, duration: this.modalHideDuration}}>
                        <div className={this.classSet('modal-dialog modal-show', this.props.className)} style={{top: -50}}>
                            <div className="modal-content">
                                {this.prepareChildren(content)}
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