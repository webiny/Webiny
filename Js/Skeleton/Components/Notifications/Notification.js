import Webiny from 'webiny';
import React from 'react';
import NotificationModal from './NotificationModal';

class WebinyNotification extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('onClick');
    }

    onClick() {
        this.dialog.show();
    }
}

WebinyNotification.defaultProps = {
    renderer() {
        const {Filters, Label, notification} = this.props;
        return (
            <div onClick={this.onClick}>
                <span>
                    {!notification.read && (
                        <Label type="success">New</Label>
                    )}
                    <strong>{notification.subject}</strong>
                </span><br/>
                <span>{notification.text}</span><br/>
                <span><Filters.TimeAgo value={notification.createdOn}/></span>
                <NotificationModal notification={notification} ref={ref => this.dialog = ref}/>
            </div>
        );
    }
};

export default Webiny.createComponent(WebinyNotification, {modules: ['Filters', 'Label']});