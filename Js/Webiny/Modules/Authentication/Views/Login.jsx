import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const UiD = Webiny.Ui.Dispatcher;

class Login extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.bindMethods('submit,onSubmit,onSubmitSuccess,renderForm');
    }

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

    renderForm(model, container) {
        return this.props.renderForm.call(this, model, container);
    }

    submit() {
        this.ui('loginForm').submit();
    }

    onSubmit(data, container) {
        this.props.onSubmit.call(this, data, container);
    }

    onSubmitSuccess(data) {
        this.props.onSubmitSuccess.call(this, data);
    }
}

Login.defaultProps = {
    api: '/entities/core/users',
    fields: '*',
    cookieName: 'webiny-token',
    onSubmit(model, container) {
        container.setState({error: null});
        return container.api.post('login', model, {_fields: this.props.fields}).then(apiResponse => {
            if (apiResponse.isError()) {
                return container.setState({error: apiResponse});
            }

            const data = apiResponse.getData();
            Webiny.Cookies.set(this.props.cookieName, data.authToken, {expires: 30, path: '/'});
            Webiny.Model.set({User: data.user});

            this.onSubmitSuccess(data);
        });
    },
    onSubmitSuccess(data) {
        const onSuccess = this.props.onSuccess;
        if (_.isFunction(onSuccess)) {
            return onSuccess(data);
        }
        Webiny.Router.goToRoute(onSuccess || Webiny.Router.getDefaultRoute());
    },
    renderForm(model, container) {
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
                    <div className="form-signin">
                        <a href="#" className="logo">
                            <img src={Webiny.Assets('Core.Backend', 'images/logo_orange.png')} width="180" height="58"/>
                        </a>

                        <h2 className="form-signin-heading">Sign in to your Account</h2>

                        <div className="clear"></div>
                        <Ui.Form.Error container={container}/>

                        <div className="clear"></div>
                        <Ui.Input name="username" placeholder="Enter email" label="Email address *" validate="required,email"/>
                        <Ui.Input {...passwordProps}/>

                        <div className="form-footer">
                            <div className="submit-wrapper">
                                <Ui.Button type="primary" size="large" onClick={this.submit} icon="icon-next">
                                    <span>Submit</span>
                                </Ui.Button>
                            </div>
                        </div>
                    </div>

                    <p className="copyright">Version 0.1 (Beta)</p>
                    <a href="#" className="site">www.webiny.com</a>
                </div>
            </div>
        );
    },
    renderer() {
        return (
            <Ui.Form.Container api={this.props.api} ui="loginForm" onSubmit={this.onSubmit}>
                {(model, container) => this.renderForm(model, container)}
            </Ui.Form.Container>
        );
    }
};

export default Login;