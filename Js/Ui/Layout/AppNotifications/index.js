import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class AppNotifications extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            unread: 0,
            viewMore: 0
        };

        this.id = _.uniqueId('app-notifications-dropdown-');
        this.api = new Webiny.Api.Endpoint(props.api);

        this.bindMethods('loadNotifications');
    }

    componentWillMount() {
        super.componentWillMount();

        this.interval = setInterval(() => this.loadNotifications(), this.props.interval);
        this.loadNotifications()
    }

    /*componentDidMount() {
        super.componentDidMount();

        $(document).on('click.' + this.id, '.' + this.id + ' .dropdown-menu', e => {
            e.stopPropagation();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        $(document).off('.' + this.id);
    }

    close() {
        $('.' + this.id).removeClass('open');
    }*/

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.interval);
        this.request && this.request.cancel();
    }

    loadNotifications() {
        if (this.request) {
            return this.request;
        }

        this.request = this.api.get('/', {_perPage: this.props.visibleNotifications}).then(apiResponse => {
            if (apiResponse.isError()) {
                return Webiny.Growl.danger(apiResponse.getError(), 'Could not fetch notifications');
            }

            const data = apiResponse.getData();

            this.setState({
                notifications: data.list,
                unread: data.meta.unread,
                viewMore: data.meta.totalCount - 3
            });
        }).then(() => {
            this.request = null;
        });
    }

    markAllRead() {
        this.api.post('mark-read').then(apiResponse => {
            if (apiResponse.isError()) {
                return Webiny.Growl.danger(apiResponse.getError(), 'Mark all as read');
            }

            this.loadNotifications();
        });
    }

}

AppNotifications.defaultProps = {
    api: '/services/webiny/app-notifications',
    interval: 10000,
    visibleNotifications: 4,
    renderer() {
        const {Link, Icon, Notification} = this.props;
        return (
            <div className={`notification-holder ${this.id}`}>
                {this.state.unread > 0 && <span className="num" data-toggle="dropdown">{this.state.unread}</span>}
                <a href="#" className="notification" data-toggle="dropdown">
                    <span className="icon-bell icon"/>
                </a>

                <div className="drop dropdown-menu" data-role="dropdown-menu" role="menu">
                    <span className="top-arr"/>
                    <ul>
                        {!this.state.notifications.length && (
                            <li>
                                <span><Icon icon="fa-coffee"/> Relax and have a sip of coffee!</span>
                            </li>
                        )}
                        {this.state.notifications.map(n => (
                            <li key={n.id}>
                                <Notification notification={n} onMarkedRead={() => this.loadNotifications()}/>
                            </li>
                        ))}
                    </ul>
                    <div className="drop-footer">
                        <Link className="read" onClick={() => this.markAllRead()}><span className="icon-check icon"/>Mark all as read</Link>
                        {this.state.viewMore > 0 && (
                            <Link route="Users.Notifications" className="settings"><span className="fa fa-search"/>View all ({this.state.viewMore} more)</Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(AppNotifications, {modules: ['Link', 'Icon', {Notification: 'Webiny/Skeleton/Notification'}]});