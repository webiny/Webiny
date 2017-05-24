import Webiny from 'Webiny';
import logoOrange from 'Assets/images/logo_orange.png';
import styles from './styles/Login.css';
const Ui = Webiny.Ui.Components;


class Login extends Webiny.Ui.View {

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
            Webiny.Model.set({User: data.user});

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
            validate: 'required,minLength:8'
        };

        return (
            <sign-in-form class="sign-in">
                <Ui.Form onSubmit={this.onSubmit}>
                    {(model, form) => (
                        <div className="container">
                            <div className="sign-in-holder">
                                <Ui.Form.Loader/>

                                <div className="form-signin">
                                    <a href="#" className="logo">
                                        <img src={logoOrange} width="180" height="58"/>
                                    </a>

                                    <h2 className="form-signin-heading"><span/>Sign in to your Account</h2>

                                    <div className="clear"></div>
                                    <Ui.Form.Error className="testing"/>

                                    <div className="clear"></div>
                                    <Ui.Input
                                        name="username"
                                        placeholder="Enter email"
                                        label="Email address"
                                        validate="required,email"
                                        onEnter={form.submit}
                                        autoFocus={true}/>
                                    <Ui.Password {...passwordProps} onEnter={form.submit}/>

                                    <div className="form-footer">
                                        <div className="submit-wrapper">
                                            <Ui.Button
                                                type="primary"
                                                size="large"
                                                onClick={form.submit}
                                                icon="icon-next"
                                                styles={styles}>
                                                <span>Submit</span>
                                            </Ui.Button>
                                        </div>
                                    </div>
                                </div>

                                <p className="copyright">Version 2.0</p>
                                <a href="#" className="site">www.webiny.com</a>
                            </div>
                        </div>
                    )}
                </Ui.Form>
            </sign-in-form>
        );
    }
};

export default Login;