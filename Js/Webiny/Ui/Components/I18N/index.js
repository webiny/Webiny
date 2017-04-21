import Webiny from 'Webiny';

class I18N extends Webiny.Ui.Component {
}

I18N.defaultProps = {
    translationKey: '',
    placeholder: '',
    variables: {},
    options: {},
    renderer() {
        return (
            <webiny-i18n
                placeholder={this.props.placeholder}
                translation-key={this.props.translationKey}>
                {Webiny.i18n(this.props.translationKey, this.props.placeholder, this.props.variables, this.props.options)}
            </webiny-i18n>
        );
    }
};

export default Webiny.createComponent(I18N);