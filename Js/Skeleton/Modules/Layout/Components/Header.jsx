import logo from 'Assets/images/logo.png';

export default function Header(props) {
    return (
        <div className="navbar navbar-inverse" role="navigation">
            <div className="navbar-header">
                <button type="button" className="nav" data-toggle="xcollapse" data-target=".navbar-collapse">
                    <span/>
                    <span/>
                    <span/>
                </button>
                <a href="#" className="search">
                </a>
                <a href="#" className="logo">
                    <img src={logo} width="62" height="20" alt="Webiny"/>
                </a>
            </div>
        </div>
    );
};