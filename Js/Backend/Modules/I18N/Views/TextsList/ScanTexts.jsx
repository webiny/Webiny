import React from 'react';
import Webiny from 'webiny';

class ScanTexts extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form
                    defaultModel={{options: ['zip']}}
                    api="/entities/webiny/i18n-texts"
                    onSubmit={async (model, form) => {
                        form.showLoading();
                        console.log(model)
                        const response = await form.api.post('/scan/import', model);
                        form.hideLoading();
                    }}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title="Scan Texts" onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.CheckboxGroup
                                            name="apps"
                                            label={this.i18n('Select apps for which you want to scan texts')}
                                            api="/services/webiny/apps"
                                            url="/installed"
                                            textAttr="name"
                                            valueAttr="name"/>

                                        <Ui.Section title="Options"/>
                                        <Ui.Checkbox name="import" label={this.i18n('Import immediately to database')}/>
                                        <Ui.Checkbox name="download" label={this.i18n('Download as ZIP archive')}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer >
                                <Ui.Button label={this.i18n(`Cancel`)} onClick={this.hide}/>

                                {!model.download && <Ui.Button type="primary" label={this.i18n(`Scan`)} onClick={form.submit}/>}
                                {model.download && (
                                    <Ui.DownloadLink
                                        separate
                                        method="POST"
                                        data={{bajo: 'asd'}}
                                        type="primary"
                                        download={Webiny.Config.ApiPath + '/entities/webiny/i18n-texts/scan/download'}>
                                        {this.i18n(`Scan`)}
                                    </Ui.DownloadLink>
                                )}

                            </Ui.Modal.Footer>
                        </Ui.Modal.Content>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ScanTexts, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'CheckboxGroup', 'Checkbox', 'Button', 'Section', 'DownloadLink'
    ]
});