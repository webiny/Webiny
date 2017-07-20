import React from 'react';
import Webiny from 'Webiny';

class Settings extends Webiny.Ui.Component {

}

Settings.defaultProps = {
    api: '/entities/webiny/settings',
    onSuccessMessage: () => 'Settings saved!',
    onSubmitSuccess: null,
    renderer() {
        const {Form} = this.props;
        const formProps = {
            api: this.props.api,
            createHttpMethod: 'patch',
            onSuccessMessage: this.props.onSuccessMessage,
            onSubmitSuccess: this.props.onSubmitSuccess,
            children: this.props.children,
            loadModel() {
                this.showLoading();
                return this.api.get('/').then(apiResponse => {
                    this.hideLoading();
                    if (apiResponse.isError()) {
                        Webiny.Growl.danger(apiResponse.getMessage(), 'That didn\'t go as expected...', true);
                        return this.handleApiError(apiResponse);
                    }
                    return apiResponse.getData();
                });
            }
        };

        return <Form {...formProps}/>;
    }
};

export default Webiny.createComponent(Settings, {modules: ['Form']});