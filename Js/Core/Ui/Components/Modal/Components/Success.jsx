import Webiny from 'Webiny';
import Dialog from './Dialog';
import Content from './Content';
import Body from './Body';
import Footer from './Footer';
import styles from '../styles.css';

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
        const {Button, Icon} = this.props;
        return (
            <Dialog modalContainerTag="success-modal" className={styles.alertModal}>
                <Content>
                    <Body>
                    <div className="text-center">
                        <Icon type="success" size="4x" icon="icon-check-circle" element="div"/>
                        <h4>{this.props.title}</h4>

                        <p>{this.renderContent()}</p>
                    </div>
                    </Body>
                    <Footer>
                        <Button type="primary" label="Close" onClick={() => this.hide().then(this.props.onClose)}/>
                    </Footer>
                </Content>
            </Dialog>
        );
    }
});

export default Webiny.createComponent(Success, {
    modules: ['Button', 'Icon'],
    api: ['show', 'hide', 'isAnimating']
});