import React from 'react';
import Webiny from 'Webiny';

const Logout = (props) => {
    return (
        <div className="drop-footer">
            <a href="javascript:void(0);" className="logout" onClick={props.logout}>
                <span className="icon-sign-out icon-bell icon"/>
                <span>Log out</span>
            </a>
        </div>
    );
};

export default Webiny.createComponent(Logout);