import Webiny from 'Webiny';
import logoOrange from 'Assets/images/logo_orange.png';
import styles from './styles/Login.css';
import View from './../../Core/View';
import createComponent from './../../createComponent';

class Login extends View {

    componentWillMount() {
        super.componentWillMount();

        // If already logged in - redirect to default route
        if (!_.isEmpty(Webiny.Model.get('User'))) {
            Webiny.Router.goToRoute(Webiny.Router.getDefaultRoute());
        }
    }

    onSubmit(model, form) {
        form.setState({error: null});
        return Webiny.Auth.getApiEndpoint().post('login', model, {_fields: Webiny.Auth.getUserFields()}).then(apiResponse => {
            if (apiResponse.isError()) {
                return form.setState({error: apiResponse});
            }

            const data = apiResponse.getData();
            if (!Webiny.Auth.isAuthorized(data.user)) {
                return form.setState({error: 'Some of your input isn\'t quite right.'});
            }

            Webiny.Cookies.set(Webiny.Auth.getCookieName(), data.authToken, {expires: 30, path: '/'});
            Webiny.Model.set('User', data.user);

            Webiny.Router.goToRoute(Webiny.Router.getDefaultRoute());
        });
    }
}

Login.defaultProps = {
    renderer() {
        const passwordProps = {
            name: 'password',
            placeholder: 'Password',
            label: 'Password',
            validate: 'required'
        };

        const {Form, Input, Password, Button} = this.props;

        return (
            <sign-in-form class="sign-in">
                <Form onSubmit={this.onSubmit}>
                    {(model, form) => (
                        <div className="container">
                            <div className="sign-in-holder">
                                <Form.Loader/>

                                <div className="form-signin">
                                    <a href="#" className="logo">
                                        <img src={logoOrange} width="180" height="58"/>
                                    </a>

                                    <h2 className="form-signin-heading"><span/>Sign in to your Account</h2>

                                    <div className="clear"/>
                                    <Form.Error className="testing"/>

                                    <div className="clear"/>
                                    <Input
                                        name="username"
                                        placeholder="Enter email"
                                        label="Email address"
                                        validate="required,email"
                                        onEnter={form.submit}
                                        autoFocus={true}/>
                                    <Password {...passwordProps} onEnter={form.submit}/>

                                    <div className="form-footer">
                                        <div className="submit-wrapper">
                                            <Button
                                                type="primary"
                                                size="large"
                                                onClick={form.submit}
                                                icon="icon-next"
                                                className={styles.btnLogin}>
                                                <span>Submit</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <p className="copyright">Version 2.0</p>
                                <a href="#" className="site">www.webiny.com</a>
                            </div>
                        </div>
                    )}
                </Form>
            </sign-in-form>
        );
    }
};

export default createComponent(Login, {modules: ['Form', 'Input', 'Password', 'Button']});