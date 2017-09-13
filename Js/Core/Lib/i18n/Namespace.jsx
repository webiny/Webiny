import React from 'react';

export default ({name, children}) => {
    return React.cloneElement(children, {i18nNamespace: name});
};