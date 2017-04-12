import Webiny from 'Webiny';
import Dialog from './Dialog';
import Body from './Body';
import Footer from './Footer';

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
        const {Button} = this.props;
        return (
            <Dialog modalContainerTag="success-modal" className="alert-modal">
                <Body>
                <div className="text-center">
                    <div className="icon icon-check-circle icon-success icon-4x"/>
                    <h4>{this.props.title}</h4>

                    <p>{this.renderContent()}</p>
                </div>
                </Body>
                <Footer>
                    <Button type="primary" label="Close" onClick={() => this.hide().then(this.props.onClose)}/>
                </Footer>
            </Dialog>
        );
    }
});

export default Webiny.createComponent(Success, {
    modules: ['Button'],
    api: ['show', 'hide', 'isAnimating']
});