import Webiny from 'Webiny';

class Login extends Webiny.Ui.View {

    componentDidMount() {
        super.componentDidMount();
        $('body').addClass('sign-in');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        $('body').removeClass('sign-in');
    }

    render() {
        return (
            <div className="container">
                <div className="sign-in-holder">
                    <form className="form-signin" role="form">
                        <a href="#" className="logo">
                            <img src={Webiny.Assets('Core.Backend', 'images/logo_orange.png')} width="180" height="58" alt="webiny"/>
                        </a>

                        <h2 className="form-signin-heading"><span></span>Sign in to your Account</h2>

                        <div className="clear"></div>
                        <div className="alert alert-danger alert-dismissabler"><span></span><strong>We couldn't sign you
                            in.</strong>
                            Please enter a valid email address
                        </div>
                        <div className="clear"></div>

                        <div className="form-group">
                            <label className="control-label">
                                Email address
                                <span className="mandat">*</span>
                            </label> <input type="email" placeholder="Enter email" className="form-control"/>
                        </div>

                        <div className="form-group error">
                            <label className="control-label">
                                Password
                                <span className="mandat">*</span>
                            </label>
                            <span className="info-txt"><a href="#">Forgot your password?</a></span>
                            <input type="password" placeholder="Password" className="form-control"/>
                            <span className="icon icon-bad"></span>
                        </div>

                        <div className="form-footer">
                            <button className="btn btn-lg btn-primary" type="submit"><span>Submit</span><span
                                className="icon right icon-next"></span></button>
                        </div>
                    </form>
                    <p className="copyright">Version 2.1</p>
                    <a href="#" className="site">www.webiny.com</a>
                </div>
            </div>
        );
    }
}

export default Login;