import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class Login extends Webiny.Ui.View {

    componentWillMount() {
        super.componentWillMount();

        // If already logged in - execute onSuccess
        if (!_.isEmpty(Webiny.Model.get('User'))) {
            if (_.isFunction(this.props.onSuccess)) {
                return this.props.onSuccess();
            }

            Webiny.Router.goToRoute(this.props.onSuccess);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        $('body').addClass('sign-in');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        $('body').removeClass('sign-in');
    }
}

Login.defaultProps = {
    api: '/entities/core/users',
    fields: '*',
    cookieName: 'webiny-token',
    onSubmit(model, container) {
        container.setState({error: null, model});
        return container.api.setQuery({fields: this.props.fields}).post('login', model).then(apiResponse => {
            if (apiResponse.isError()) {
                return container.setState({error: apiResponse.getError()});
            }

            const data = apiResponse.getData();
            Webiny.Cookies.set(this.props.cookieName, data.authToken, {expires: 30, path: '/'});
            Webiny.Model.set({User: data.user});

            this.props.onSubmitSuccess.call(this, data);
        });
    },
    onSubmitSuccess(data) {
        const onSuccess = this.props.onSuccess;
        if (_.isFunction(onSuccess)) {
            return onSuccess(data);
        }
        Webiny.Router.goToRoute(onSuccess || Webiny.Router.getDefaultRoute());
    },
    renderForm() {
        const passwordProps = {
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            label: 'Password *',
            validate: 'required,password',
            description: <span className="info-txt"><a tabIndex="-1" href="#">Forgot your password?</a></span>
        };

        return (
            <div className="container">
                <div className="sign-in-holder">
                    <Ui.Form.Form className="form-signin" layout={false}>
                        <fields>
                            <a href="#" className="logo">
                                <img src={Webiny.Assets('Core.Backend', 'images/logo_orange.png')} width="180" height="58"/>
                            </a>

                            <h2 className="form-signin-heading">Sign in to your Account</h2>

                            <div className="clear"></div>
                            <Ui.Show if={UiD.value('loginForm.state.error')}>
                                <div className="alert alert-danger alert-dismissable">
                                    <span className="icon icon-cancel-circled"></span>
                                    <Ui.Value value="loginForm.state.error"/>
                                </div>
                            </Ui.Show>

                            <div className="clear"></div>
                            <Ui.Input name="username" placeholder="Enter email" label="Email address *" validate="required,email"/>
                            <Ui.Input {...passwordProps}/>

                            <div className="form-footer">
                                <div className="submit-wrapper">
                                    <Ui.Button type="primary" size="large" onClick={this.ui('loginForm:submit')} icon="icon-next">
                                        <span>Submit</span>
                                    </Ui.Button>
                                </div>
                            </div>
                        </fields>
                    </Ui.Form.Form>

                    <p className="copyright">Version 0.1 (Beta)</p>
                    <a href="#" className="site">www.webiny.com</a>
                </div>
            </div>
        );
    },
    renderer() {
        return (
            <Ui.Form.ApiContainer api={this.props.api} ui="loginForm" onSubmit={this.props.onSubmit.bind(this)}>
                {this.props.renderForm.call(this)}
            </Ui.Form.ApiContainer>
        );
    }
};

export default Login;