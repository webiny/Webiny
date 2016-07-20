import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Settings extends Webiny.Ui.Component {

}

Settings.defaultProps = {
    id: null,
    onSuccessMessage: () => 'Settings saved!',
    renderer() {
        const formProps = {
            api: '/entities/core/settings',
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