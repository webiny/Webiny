import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import styles from '../styles/Modal.css';

class Success extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.data = [];
        this.bindMethods('renderContent');
    }

    renderContent() {
        let content = this.props.message;
        if (!content) {
            content = this.props.children;
        }

        if (_.isFunction(content)) {
            content = content();
        }
        return content;
    }

    setData(...data) {
        this.data = data;
        return this;
    }
}

Success.defaultProps = _.merge({}, Webiny.Ui.ModalComponent.defaultProps, {
    title: 'Awesome!',
    close: 'Close',
    onClose: _.noop,
    renderDialog() {
        return (
            <Ui.Modal.Dialog modalContainerTag="success-modal" className={styles.alertModal}>
                <Ui.Modal.Body>
                    <div className="text-center">
                        <div className="icon icon-check-circle icon-success icon-4x"></div>
                        <h4>{this.props.title}</h4>

                        <p>{this.renderContent()}</p>
                    </div>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="primary" label="Close" onClick={() => this.hide().then(this.props.onClose)}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
});

export default Success;