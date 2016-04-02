import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

let handlersBound = false;

class Dialog extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShown: false
        };

        this.bindMethods('show,hide,bindHandlers,unbindHandlers,prepareChildren,prepareChild');
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({isShown: this.props.show});
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({isShown: props.show});
    }

    componentDidMount() {
        super.componentDidMount();
        this.bindHandlers();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unbindHandlers();
    }

    bindHandlers() {
        if (handlersBound) {
            return;
        }

        $('webiny-modal-container').on('keyup.modal', '.modal', e => {
            // Listen for ESC button
            if (e.keyCode === 27) {
                this.hide();
            }
        }).on('click.modal', '.modal', e => {
            // Catch backdrop click
            if ($(e.target).hasClass('modal')) {
                if (this.props.closeOnClick) {
                    this.hide();
                }
            }
        });

        handlersBound = true;
    }

    unbindHandlers() {
        $('webiny-modal-container').off('.modal');
        handlersBound = false;
    }

    hide() {
        this.props.onHide();

        this.setState({
            isShown: false
        }, this.props.onHidden);

    }

    show() {
        this.props.onShow();
        this.setState({
            isShown: true
        }, this.props.onShown);
    }

    prepareChild(child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        // Table handles Row and Footer
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
    renderer: function renderer() {
        if (!this.state.isShown) {
            Webiny.Ui.Dispatcher.get('ModalContainer').setContent(null);
            return null;
        }

        const className = this.classSet({modal: true, 'modal-wizard': this.props.wide});

        Webiny.Ui.Dispatcher.get('ModalContainer').setContent(
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

        return null;
    }
};

export default Dialog;
