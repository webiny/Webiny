import Webiny from 'webiny';
import React from 'react';
import createComponent from './../createComponent';
import Component from './../Core/Component';

class I18n extends Component {
}

I18n.defaultProps = {
    translationKey: '',
    text: '',
    variables: {},
    renderer() {
        return React.createElement(
            'webiny-i18n',
            {
                text: this.props.text,
                'translation-key': this.props.translationKey
            },
            Webiny.I18n(this.props.text, this.props.variables, this.props.translationKey)
        );
    }
};

export default createComponent(I18n, {i18n: true});