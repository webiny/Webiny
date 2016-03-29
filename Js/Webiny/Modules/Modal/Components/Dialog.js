import Webiny from 'Webiny';

class Dialog extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShown: false
        };

        this.bindMethods('show,hide');
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({isShown: this.props.show});
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({isShown: props.show});
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

    render() {
        // TODO: parse children and pass onClose to Header

        if(!this.state.isShown) {
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
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );

        return null;
    }
}

Dialog.defaultProps = {
    wide: false,
    onHide: _.noop,
    onHidden: _.noop,
    onShow: _.noop,
    onShown: _.noop
};

export default Dialog;
