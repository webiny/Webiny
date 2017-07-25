import React from 'react';
import Webiny from 'Webiny';

const Header = (props) => {
    return React.createElement(props.header);
};


export default Webiny.createComponent(Header, {modules: [{header: 'Webiny/Layout/Header'}]});