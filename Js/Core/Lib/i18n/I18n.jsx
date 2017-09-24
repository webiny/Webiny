import Webiny from 'webiny';
import React from 'react';
import createComponent from './../createComponent';
import Component from './../Core/Component';

class I18n extends Component {
}

I18n.defaultProps = {
    textKey: '',
    base: '',
    variables: {},
    renderer() {
        return React.createElement(
            'webiny-i18n',
            null,
            Webiny.I18n(this.props.base, this.props.variables, this.props.textKey)
        );
    }
};

export default createComponent(I18n, {i18n: true});