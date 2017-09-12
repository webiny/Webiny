import Webiny from 'webiny';
import React from 'react';
import createComponent from './../createComponent';
import Component from './../Core/Component';

class I18N extends Component {
}

I18N.defaultProps = {
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
            Webiny.i18n(this.props.text, this.props.variables, this.props.translationKey)
        );
    }
};

export default createComponent(I18N, {i18n: true});