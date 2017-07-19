import Webiny from 'Webiny';
import React from 'react';
import {ReactDOM} from 'react-dom';
import createComponent from './../createComponent';
import Component from './../Core/Component';

class I18N extends Component {
}

I18N.defaultProps = {
    translationKey: '',
    placeholder: '',
    variables: {},
    options: {},
    renderer() {
        return ReactDOM.createElement(
            'webiny-i18n',
            {
                placeholder: this.props.placeholder,
                'translation-key': this.props.translationKey
            },
            Webiny.i18n(this.props.translationKey, this.props.placeholder, this.props.variables, this.props.options)
        );
    }
};

export default createComponent(I18N, {i18n: true});