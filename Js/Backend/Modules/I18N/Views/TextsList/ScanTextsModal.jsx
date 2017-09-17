import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

/**
 * @i18n.namespace Webiny.Backend.I18N.ScanTexts
 */
class ScanTextsModal extends Webiny.Ui.ModalComponent {
    canSubmit(model) {
        if (_.isEmpty(model)) {
            return;
        }

        return _.size(model.apps) && (model.download || model.import);
    }

    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form
                    defaultModel={{apps: [], download: false, import: false}}
                    api="/entities/webiny/i18n-texts"
                    url="/scan/import"
                    onSuccessMessage={null}
                    onSubmitSuccess={async response => {
                        Webiny.Growl.success(
                            this.i18n(`Inserted {inserted|plural:1:translation:default:translations} ({ignored} ignored).`, {
                                inserted: {
                                    value: response.getData('inserted'),
                                    format: output => <strong>{output}</strong>
                                },
                                ignored: <strong>{response.getData('ignored')}</strong>
                            })
                        );

                        await this.hide();
                        this.props.onTextsScanned();
                    }}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title={this.i18n(`Scan Texts`)} onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Form.Error/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.CheckboxGroup
                                            name="apps"
                                            label={this.i18n('Select apps to scan for texts')}
                                            api="/services/webiny/apps"
                                            url="/installed"
                                            textAttr="name"
                                            valueAttr="name"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <Ui.Section title="Options"/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Checkbox name="import" label={this.i18n('Import immediately to database')}/>
                                        <Ui.Checkbox name="download" label={this.i18n('Download as ZIP archive')}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                            </Ui.Modal.Body>
                            <Ui.Modal.Footer >
                                <Ui.Button label={this.i18n(`Cancel`)} onClick={this.hide}/>

                                <Ui.Button
                                    renderIf={!model.download}
                                    disabled={!this.canSubmit(model)}
                                    type="primary"
                                    label={this.i18n(`Scan`)}
                                    onClick={form.submit}/>

                                <Ui.DownloadLink
                                    renderIf={model.download}
                                    separate
                                    disabled={!this.canSubmit(model)}
                                    onClick={() => {
                                        console.log('saddas')
                                    }}
                                    method="POST"
                                    params={{import: model.import, apps: model.apps}}
                                    type="primary"
                                    download={Webiny.Config.ApiPath + '/entities/webiny/i18n-texts/scan/export'}>
                                    {this.i18n(`Scan`)}
                                </Ui.DownloadLink>

                            </Ui.Modal.Footer>
                        </Ui.Modal.Content>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

ScanTextsModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps, {
    onTextsScanned: _.noop
});

export default Webiny.createComponent(ScanTextsModal, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'CheckboxGroup', 'Checkbox', 'Button', 'Section', 'DownloadLink'
    ]
});