import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Settings extends Webiny.Ui.Component {

}

Settings.defaultProps = {
    id: null,
    api: '/entities/core/settings',
    onSuccessMessage: () => 'Settings saved!',
    renderer() {
        const formProps = {
            api: this.props.api,
            fields: '*',
            url: 'key',
            id: this.props.id,
            onSuccessMessage: this.props.onSuccessMessage,
            children: this.props.children
        };

        return <Ui.Form.Container {...formProps}/>;
    }
};

export default Settings;