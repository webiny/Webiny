import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import Dialog from './Dialog';
import Content from './Content';
import Body from './Body';
import Footer from './Footer';
import styles from '../styles.css';

class Success extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);

        this.bindMethods('renderContent');
    }

    renderContent() {
        let content = this.props.message;
        if (!content) {
            content = this.props.children;
        }

        if (_.isFunction(content)) {
            content = content(this);
        }
        return content;
    }

    renderFooter() {
        let {Button, closeBtn, onClose} = this.props;
        let button = null;

        if (_.isFunction(closeBtn)) {
            closeBtn = closeBtn(this);
        }

        if (_.isString(closeBtn)) {
            button = <Button type="primary" label={closeBtn} onClick={() => this.hide().then(onClose)}/>;
        }

        if (React.isValidElement(closeBtn)) {
            button = closeBtn;
        }

        return (
            <Footer>{button}</Footer>
        );
    }
}

Success.defaultProps = _.merge({}, Webiny.Ui.ModalComponent.defaultProps, {
    title: 'Awesome!',
    closeBtn: 'Close',
    onClose: _.noop,
    onShown: _.noop,
    renderDialog() {
        const {Icon, onShown} = this.props;
        return (
            <Dialog modalContainerTag="success-modal" className={styles.alertModal} onShown={onShown}>
                <Content>
                    <Body>
                    <div className="text-center">
                        <Icon type="success" size="4x" icon="icon-check-circle" element="div"/>
                        <h4>{this.props.title}</h4>

                        <div>{this.renderContent()}</div>
                    </div>
                    </Body>
                    {this.renderFooter()}
                </Content>
            </Dialog>
        );
    }
});

export default Webiny.createComponent(Success, {
    modules: ['Button', 'Icon'],
    api: ['show', 'hide', 'isAnimating']
});