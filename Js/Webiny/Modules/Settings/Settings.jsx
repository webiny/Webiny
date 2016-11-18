import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Settings extends Webiny.Ui.Component {

}

Settings.defaultProps = {
    api: '/entities/core/settings',
    onSuccessMessage: () => 'Settings saved!',
    onSubmitSuccess: null,
    renderer() {
        const formProps = {
            api: this.props.api,
            createHttpMethod: 'patch',
            onSuccessMessage: this.props.onSuccessMessage,
            onSubmitSuccess: this.props.onSubmitSuccess,
            children: this.props.children,
            loadModel() {
                return this.api.get('/').then(apiResponse => {
                    return apiResponse.getData();
                });
            }
        };

        return <Ui.Form {...formProps}/>;
    }
};

export default Settings;