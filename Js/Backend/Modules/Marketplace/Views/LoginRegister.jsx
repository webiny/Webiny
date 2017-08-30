import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';
import LoginModal from './../Components/LoginModal'
import RegisterModal from './../Components/RegisterModal'
import ForgotPasswordModal from './../Components/ForgotPasswordModal'


class LoginRegister extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.bindMethods('showLogin,showRegister,showForgotPassword');
    }

    showLogin() {
        this.loginModal.show();
    }

    showRegister() {
        this.registerModal.show();
    }

    showForgotPassword() {
        this.forgotPasswordModal.show();
    }
}

LoginRegister.defaultProps = {

    renderer() {

        const {styles, Button, Icon} = this.props;

        const childProps = {
            showLogin: this.showLogin,
            showRegister: this.showRegister,
            showForgotPassword: this.showForgotPassword
        };

        return (
            <div className={styles.loginRegister}>
                <div className={styles.message}>
                    <h2>
                        <Icon icon="icon-basket_n"/>
                        Webiny Marketplace
                    </h2>
                    <h3>Find and Install Apps for Webiny</h3>
                    <p>Access to the markeplace requires a Webiny.com profile. <br/>If you already have a profile, use the sign-in option,
                        otherwise please register.</p>
                    <div className={styles.actions}>
                        <Button type="primary" label="Sign In" icon="fa-lock" size="large" onClick={() => this.showLogin()}/>
                        <Button type="secondary" label="Register" icon="fa-user" size="large" onClick={() => this.showRegister()}/>
                    </div>
                </div>
                <LoginModal {...childProps} ref={ref => this.loginModal = ref}/>
                <RegisterModal {...childProps} ref={ref => this.registerModal = ref}/>
                <ForgotPasswordModal {...childProps} ref={ref => this.forgotPasswordModal = ref}/>
            </div>
        );
    }
};

export default Webiny.createComponent(LoginRegister, {styles, modules: ['Button', 'Icon']});