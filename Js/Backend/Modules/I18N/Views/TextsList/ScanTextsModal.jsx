import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

/**
 * @i18n.namespace Webiny.Backend.I18N.ScanTexts
 */
class ScanTextsModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form
                    defaultModel={{apps: [], options: {overwriteExisting: true}}}
                    api="/entities/webiny/i18n-texts"
                    onSubmit={async (model, form) => {
                        form.showLoading();
                        form.setState('model.response', null);
                        const response = await form.api.post('/scan', model);
                        form.hideLoading();

                        if (response.isError()) {
                            Webiny.Growl.danger(response.getMessage());
                        }
                        form.setState('model.results', {data: response.getData()}, () => this.props.onTextsScanned());
                    }}>
                    {(model, form) => {

                        let results = null;
                        if (model.results) {
                            results = (
                                <Ui.Alert type="success">
                                    {this.i18n('Translations were successfully imported! following changes were applied:')}
                                    <ul>
                                        <li>{this.i18n('{num} created', {num: <strong>{model.results.data.created}</strong>})}</li>
                                        <li>{this.i18n('{num} updated', {num: <strong>{model.results.data.updated}</strong>})}</li>
                                        <li>{this.i18n('{num} ignored', {num: <strong>{model.results.data.ignored}</strong>})}</li>
                                    </ul>
                                </Ui.Alert>
                            );
                        }

                        return (
                            <Ui.Modal.Content>
                                <Ui.Form.Loader/>
                                <Ui.Modal.Header title={this.i18n(`Scan Texts`)} onClose={this.hide}/>
                                <Ui.Modal.Body>
                                    <Ui.Form.Error/>
                                    {results}
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.CheckboxGroup
                                                validate="required"
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
                                            <Ui.Checkbox
                                                name="options.overwriteExisting"
                                                label={this.i18n('Overwrite existing keys')}
                                                tooltip={this.i18n('Previously scanned texts will be overwritten.')}/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>

                                </Ui.Modal.Body>
                                <Ui.Modal.Footer >
                                    <Ui.Button label={this.i18n(`Cancel`)} onClick={this.hide}/>
                                    <Ui.Button
                                        type="primary"
                                        label={this.i18n(`Scan`)}
                                        onClick={form.submit}/>
                                </Ui.Modal.Footer>
                            </Ui.Modal.Content>
                        );
                    }}
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
        'Modal', 'Form', 'Grid', 'CheckboxGroup', 'Checkbox', 'Button', 'Section', 'DownloadLink', 'Alert'
    ]
});