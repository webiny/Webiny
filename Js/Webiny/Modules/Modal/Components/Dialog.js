import Webiny from 'Webiny';
import DialogHolder from './DialogHolder';
const Ui = Webiny.Ui.Components;

class Dialog extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShown: false
        };

        this.clickStartedOnBackdrop = false;

        this.bindMethods('show,hide,bindHandlers,unbindHandlers,prepareChildren,prepareChild');
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.state.isShown) {
            this.bindHandlers();
        } else {
            this.unbindHandlers();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unbindHandlers();
        Webiny.Ui.Dispatcher.get('ModalContainer').setContent(null);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
    }

    bindHandlers() {
        $('webiny-modal-container').on('keyup.modal', '.modal', e => {
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
        $('webiny-modal-container').off('.modal');
    }

    hide() {
        this.props.onHide();
        this.setState({
            isShown: false
        });
    }

    show() {
        this.props.onShow();
        this.setState({
            isShown: true
        });
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
    renderer() {
        const ModalContainer = Webiny.Ui.Dispatcher.get('ModalContainer');

        if (!ModalContainer) {
            return null;
        }

        if (!this.state.isShown) {
            ModalContainer.setContent(null);
            return null;
        }

        const className = this.classSet({modal: true, 'modal-wizard': this.props.wide});

        ModalContainer.setContent(
            <DialogHolder onShown={this.props.onShown} onHidden={this.props.onHidden}>
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
            </DialogHolder>
        );

        return null;
    }
};

export default Dialog;