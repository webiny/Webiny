import Webiny from 'Webiny';

class Settings extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {};
    }

    getSettings() {
        const key = Webiny.Router.getParam('settingsKey');
        let settings = null;
        Webiny.Tools.getAppsSettings().forEach(s => {
            if (s.key === key) {
                settings = s;
            }
        });

        return settings;
    }

    onSubmit(data) {
        console.log('Settings saved: ', data);
    }

    render() {
        const settings = this.getSettings();
        const props = {
            onSubmit: this.onSubmit,
            title: settings.label,
            model: {}
        };

        return React.isValidElement(settings.view) ? React.cloneElement(settings.view, props) : React.createElement(settings.view, props);
    }
}

export default Settings;
