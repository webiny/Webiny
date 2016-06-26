import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

const mountedDialogs = [];

function getShownDialog() {
    return _.find(mountedDialogs, item => item.state.isShown === true);
}

class Dialog extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.id = _.uniqueId('modal-dialog-');

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

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        const currentDialog = getShownDialog();
        if (currentDialog && currentDialog.id !== this.id && nextState.isShown) {
            $(currentDialog.modalContainer).hide();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.isShown()) {
            $(this.modalContainer).show();
            ReactDOM.render(this.props.renderDialog.call(this), this.modalContainer);
            $(this.modalContainer).find('.modal').focus();
            $(this.modalContainer).find('.modal-dialog').addClass('modal-show');
            $(this.modalContainer).find('.modal-backdrop').addClass('in');
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
        this.props.onHide();
        // TODO: add setTimeout to setState for this to work
        // $(this.modalContainer).find('.modal-dialog').removeClass('modal-show');
        // $(this.modalContainer).find('.modal-backdrop').removeClass('in');
        this.setState({
            isShown: false
        }, () => {
            this.props.onHidden();
        });
    }

    show() {
        this.props.onShow();
        this.setState({
            isShown: true
        }, () => {
            this.props.onShown();
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
                <div className="modal-backdrop"></div>
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