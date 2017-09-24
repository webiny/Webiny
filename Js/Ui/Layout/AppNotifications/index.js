import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class AppNotifications extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: []
        };

        this.bindMethods('loadNotifications');
    }

    componentWillMount() {
        super.componentWillMount();

        this.interval = setInterval(() => this.loadNotifications(), this.props.interval);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.interval);
        this.request && this.request.cancel();
    }

    loadNotifications() {
        this.request = new Webiny.Api.Endpoint(this.props.api).get('/').then(apiResponse => {
            if (apiResponse.isError()) {
                return Webiny.Growl.danger(apiResponse.getError(), 'Could not fetch notifications');
            }

            this.setState({notifications: apiResponse.getData('list')})
        });
    }
}

AppNotifications.defaultProps = {
    api: '/services/webiny/app-notifications',
    interval: 10000,
    renderer() {
        const {Link} = this.props;
        const count = this.state.notifications.length;
        return (
            <div className="notification-holder open">
                {count > 0 && <span className="num" data-toggle="dropdown">{count}</span>}
                <a href="#" className="notification" id="dropdownMenu5" data-toggle="dropdown">
                    <span className="icon-bell icon"/>
                </a>

                <div className="drop dropdown-menu" role="menu" aria-labelledby="dropdownMenu5">
                    <span className="top-arr"/>
                    <ul>
                        {this.state.notifications.map(n => {
                            const Notification = this.types[n.type];
                            if (!Notification) {
                                return null;
                            }

                            return (
                                <li><Notification data={n}/></li>
                            );
                        })}
                    </ul>
                    <Link onClick={_.noop} className="all">VIEW ALL (14 MORE)</Link>

                    <div className="drop-footer">
                        <Link className="read"><span className="icon-check icon"/>Mark all as read</Link>
                    </div>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(AppNotifications, {modules: ['Link']});