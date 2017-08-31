import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

const User = (props) => {
    if (!props.user) {
        return null;
    }

    const {Gravatar} = props;

    return (
        <div className="user-welcome">
            <div className="user-welcome__avatar">
                <div className="avatar avatar--inline avatar--small">
                    <span className="avatar-placeholder avatar-placeholder--no-border">
                        <Gravatar className="avatar img-responsive" hash={props.user.gravatar} size="50"/>
                    </span>
                </div>
            </div>
            <h3 className="user-welcome__message">Hi {_.get(props.user, 'firstName', _.get(props.user, 'email'))}!</h3>
        </div>
    );
};

export default Webiny.createComponent(User, {modules: ['Gravatar']});