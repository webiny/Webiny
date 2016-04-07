import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class Login extends Webiny.Ui.View {

    componentWillMount(){
        super.componentWillMount();

        // If already logged in - execute onSuccess
        if (!_.isEmpty(Webiny.Model.get('User'))) {
            if(_.isFunction(this.props.onSuccess)){
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

    getConfig() {
        const api = this.props.api;
        const onSuccess = this.props.onSuccess;
        const tokenName = this.props.tokenName;
        return {
            onSubmit(model){
                this.setState({error: null, model});
                return new Webiny.Api.Entity(api).post('login', model).then(apiResponse => {
                    if (apiResponse.isError()) {
                        return this.setState({error: apiResponse.getError()});
                    }

                    const data = apiResponse.getData();
                    Webiny.Cookies.set(tokenName, data.authToken, {expires: 30, path: '/'});
                    Webiny.Model.set({User: data.user});

                    if (_.isFunction(onSuccess)) {
                        return onSuccess(data);
                    }

                    Webiny.Router.goToRoute(onSuccess);
                });
            }
        };
    }
}

Login.defaultProps = {
    api: '/core/users',
    renderer: function renderer() {
        return (
            <Ui.Form.Container ui="loginForm" {...this.getConfig.call(this)}>
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
                                <Ui.Input name="password" placeholder="Password" label="Password *" validate="required,password"
                                          description={<span className="info-txt"><a tabIndex="-1" href="#">Forgot your password?</a></span>}/>

                                <div className="form-footer">
                                    <Ui.Button type="primary" size="large" onClick={this.ui('loginForm:submit')} label="Submit"
                                               icon="icon-next"/>
                                </div>
                            </fields>
                        </Ui.Form.Form>

                        <p className="copyright">Version 0.1 (Beta)</p>
                        <a href="#" className="site">www.webiny.com</a>
                    </div>
                </div>
            </Ui.Form.Container>
        );
    }
};

export default Login;