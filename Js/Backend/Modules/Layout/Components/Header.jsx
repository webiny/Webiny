import Webiny from 'Webiny';
import logo from 'Assets/images/logo.png';

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

Header.defaultProps = {
    renderer() {
        return (
            <Webiny.Ui.LazyLoad modules={['Link']}>
                {(Ui) => (
                    <div className="navbar navbar-inverse" role="navigation">
                        <div className="navbar-header">
                            <button type="button" className="nav" data-toggle="xcollapse" data-target=".navbar-collapse" onClick={()=>{
                                $('body').toggleClass('opened-mobile-nav');
                            }}>
                                <span/>
                                <span/>
                                <span/>
                            </button>
                            <a href="#" className="logo">
                                <img src={logo} width="62" height="20" alt="Webiny"/>
                            </a>

                            <div className="dropdown profile-holder">
                                <a href="#" className="profile" id="dropdownMenu4" data-toggle="dropdown">
                                    <span className="icon-user icon"/>
                                    <span className="user">
                                        {_.get(this.state.user, 'firstName', '')} {_.get(this.state.user, 'lastName', '')}
                                    </span>
                                </a>

                                <div className="drop dropdown-menu" role="menu" aria-labelledby="dropdownMenu4">
                                    <span className="top-arr"/>
                                    <ul>
                                        <li>
                                            <Ui.Link route="Users.Account">Account preferences</Ui.Link>
                                            <span>Set your account and user preferences </span>
                                        </li>
                                    </ul>
                                    <div className="drop-footer">
                                        <a href="javascript:void(0);" className="logout" onClick={this.logout}>
                                            <span className="icon-sign-out icon-bell icon"/>
                                            <span>Log out</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default Header;