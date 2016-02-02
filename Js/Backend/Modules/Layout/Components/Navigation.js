import Webiny from 'Webiny';

class Navigation extends Webiny.Ui.Component {

    render() {
        const Layout = Webiny.Apps.Core.Backend.Layout.Components;

        return (
            <div className="master-navigation">
                <Layout.Header/>

                <div className="navbar-collapse collapse" id="left-sidebar">
                    <div className="shield"></div>
                    <div className="domain-picker-mobile visible-xs">
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu10" data-toggle="dropdown">
                                <span className="domain-name">www.badabing.com.hr</span>
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu10">
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">www.booking.com</a></li>
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">www.amazon.com</a></li>
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">www.apple.com</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="search-holder visible-xs">
                        <input type="text" placeholder="Search..."/>
                    </div>
                    <div className="left-menu">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="dashboard"><a href="#">
                                <span className="icon-gauge icon app-icon"></span>
                                <span className="app-title">Dashboard</span>
                                <span className="icon-caret-down icon mobile-caret"></span>
                            </a>
                            </li>
                            <li className="content active">
                                <a href="#" data-open-submenu="content">
                                    <span className="icon-browser icon app-icon"></span>
                                    <span className="app-title">Content</span>
                                    <span className="icon-caret-down icon mobile-caret"></span>
                                </a>
                                <ul className="subnavigation only-mob">
                                    <li><a href="#">Posts</a>
                                        <a href="#" className="small"><span>Add post</span>
                                            <span className="icon-plus-circled icon"></span>
                                        </a>
                                    </li>
                                    <li><a href="#">Pages</a></li>
                                    <li className="active"><a href="#">Menus</a>
                                        <ul>
                                            <li><a href="#">Add new page</a></li>
                                            <li><a href="#">View all pages</a></li>
                                            <li><a href="#">Download all content</a></li>
                                            <li><a href="#">Sub item No. 4</a></li>
                                            <li><a href="#">Sub item</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="#">Widgets</a></li>
                                    <li><a href="#">Plugins</a></li>
                                    <li><a href="#">Users</a></li>
                                    <li><a href="#">Stats</a></li>
                                </ul>
                            </li>
                            <li className="booking">
                                <a href="#" data-open-submenu="booking">
                                    <span className="icon-calendar icon app-icon"></span>
                                    <span className="app-title">Booking</span>
                                    <span className="icon-caret-down icon mobile-caret"></span>
                                </a>

                            </li>
                            <li className="store">
                                <a href="#" data-open-submenu="store">
                                    <span className="icon-basket_n icon app-icon"></span>
                                    <span className="app-title">Store</span>
                                    <span className="icon-caret-down icon mobile-caret"></span>
                                </a>
                            </li>
                            <li className="settings">
                                <a href="#" data-open-submenu="settings">
                                    <span className="icon-settings icon app-icon"></span>
                                    <span className="app-title">Settings</span>
                                    <span className="icon-caret-down icon mobile-caret"></span>
                                </a>
                            </li>
                            <li className="users">
                                <a href="#" data-open-submenu="user">
                                    <span className="icon-user icon app-icon"></span>
                                    <span className="app-title">Users</span>
                                    <span className="icon-caret-down icon mobile-caret"></span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="left-menu-submenu">
                        <div>
                            <ul className="subnavigation" data-this-menu="content" style={{display: 'block'}}>
                                <li><a href="#">Posts</a>
                                    <a href="#" className="small quick-link"><span>Add post</span>
                                        <span className="icon-plus-circled icon"></span>
                                    </a>
                                </li>
                                <li><a href="#">Pages</a></li>
                                <li className="active">
                                    <a href="#">Menus</a>
                                    <span className="icon-caret-down icon"></span>
                                    <ul>
                                        <li><a href="#">Add new page</a></li>
                                        <li><a href="#">View all pages</a></li>
                                        <li className="active"><a href="#">Download all content</a></li>
                                        <li><a href="#">Sub item No. 4</a></li>
                                        <li><a href="#">Sub item</a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="#">Widgets</a>
                                    <span className="icon-caret-down icon"></span>
                                </li>
                                <li><a href="#">Plugins</a></li>
                                <li><a href="#">Users</a></li>
                                <li><a href="#">Stats</a></li>
                            </ul>

                            <ul className="subnavigation" data-this-menu="booking">
                                <li><a href="#">Posts</a>
                                    <a href="#" className="small"><span>Add BOOKING</span>
                                        <span className="icon-plus-circled icon"></span>
                                    </a>
                                </li>
                                <li><a href="#">Pages</a></li>
                                <li className="active"><a href="#">Menus</a>
                                    <ul>
                                        <li><a href="#">Add new page</a></li>
                                        <li><a href="#">View all pages</a></li>
                                        <li><a href="#">Download all content</a></li>
                                        <li><a href="#">Sub item No. 4</a></li>
                                        <li><a href="#">Sub item</a></li>
                                    </ul>
                                </li>
                                <li><a href="#">Widgets</a></li>
                                <li><a href="#">Plugins</a></li>
                                <li><a href="#">Users</a></li>
                                <li><a href="#">Stats</a></li>
                            </ul>

                            <ul className="subnavigation" data-this-menu="store">
                                <li><a href="#">Posts</a>
                                    <a href="#" className="small"><span>Add ITEM</span>
                                        <span className="icon-plus-circled icon"></span>
                                    </a>
                                </li>
                                <li><a href="#">Pages</a></li>
                                <li className="active"><a href="#">Menus</a>
                                    <ul>
                                        <li><a href="#">Add new page</a></li>
                                        <li><a href="#">View all pages</a></li>
                                        <li><a href="#">Download all content</a></li>
                                        <li><a href="#">Sub item No. 4</a></li>
                                        <li><a href="#">Sub item</a></li>
                                    </ul>
                                </li>
                                <li><a href="#">Widgets</a></li>
                                <li><a href="#">Plugins</a></li>
                                <li><a href="#">Users</a></li>
                                <li><a href="#">Stats</a></li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigation;
