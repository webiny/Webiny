import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Settings extends Webiny.Ui.Component {

}

Settings.defaultProps = {
    id: null,
    api: '/entities/core/settings',
    onSuccessMessage: () => 'Settings saved!',
    onSubmitSuccess: null,
    renderer() {
        const formProps = {
            api: this.props.api,
            fields: '*',
            url: 'key',
            id: this.props.id,
            onSuccessMessage: this.props.onSuccessMessage,
            onSubmitSuccess: this.props.onSubmitSuccess,
            children: this.props.children
        };

        return <Ui.Form {...formProps}/>;
    }
};

export default Settings;