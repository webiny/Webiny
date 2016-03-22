import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.watch('User', (data) => {
            this.setState({user: data});
        });
    }

    logout() {
        Webiny.Dispatcher.dispatch('Logout');
    }
}

function renderer() {
    const Layout = Webiny.Apps.Core.Backend.Layout.Components;

    return (
        <div className="navbar navbar-inverse" role="navigation">
            <div className="navbar-header">
                <button type="button" className="nav" data-toggle="xcollapse" data-target=".navbar-collapse">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <a href="#" className="search">
                </a>
                <a href="#" className="logo">
                    <img src={Webiny.Assets('Core.Backend', 'images/logo.png')} width="62" height="20" alt="Webiny"/>
                </a>

                <div className="package">
                    <p>Package:<a href="#">Starter</a><a href="#" className="upgrade">Upgrade</a></p>
                </div>
                <Layout.DomainPicker actionLabel="Add new website"/>

                <div className="dropdown profile-holder">
                    <a href="#" className="profile" id="dropdownMenu4" data-toggle="dropdown">
                        <span className="icon-user icon"></span>
                        <span className="user">{_.get(this.state.user, 'firstName', '')} {_.get(this.state.user, 'lastName', '')}</span>
                        <span className="icon-caret-down icon"></span>
                    </a>

                    <div className="drop dropdown-menu" role="menu" aria-labelledby="dropdownMenu4">
                        <span className="top-arr"></span>

                        <div className="drop-footer">
                            <a href="javascript:void(0);" className="logout" onClick={this.logout}>
                                <span className="icon-sign-out icon-bell icon"></span>
                                <span>Log out</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="notification-holder">
                    <span className="num" data-toggle="dropdown">12</span>
                    <a href="#" className="notification" id="dropdownMenu5" data-toggle="dropdown">
                        <span className="icon-bell icon"></span>
                    </a>

                    <div className="drop dropdown-menu" role="menu" aria-labelledby="dropdownMenu5">
                        <span className="top-arr"></span>
                        <ul>
                            <li>
                                <span className=" icon-exclamation-circle icon"></span>

                                <div className="drop-txt">
                                    <a href="#">Your payment is due </a>
                                    <span>Review</span>
                                </div>
                            </li>
                            <li>
                                <span className=" icon-exclamation-circle icon"></span>

                                <div className="drop-txt">
                                    <a href="#">Your payment is due </a>
                                    <span>Review</span>
                                </div>
                            </li>
                            <li>
                                <span className=" icon-exclamation-circle icon"></span>

                                <div className="drop-txt">
                                    <a href="#">Your payment is due </a>
                                    <span>Review</span>
                                </div>
                            </li>
                        </ul>
                        <a href="#" className="all">VIEW ALL (14 MORE)</a>

                        <div className="drop-footer">
                            <a href="#" className="read">
                                <span className="icon-check icon"></span>
                                Mark all as read</a>
                            <a href="#" className="settings">Settings</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Header.defaultProps = {
    renderer
};

export default Header;