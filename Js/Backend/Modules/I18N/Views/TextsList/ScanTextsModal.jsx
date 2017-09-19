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
                    defaultModel={{apps: []}}
                    api="/entities/webiny/i18n-texts"
                    url="/scan"
                    onSuccessMessage={null}
                    onSubmitSuccess={async response => {
                        Webiny.Growl.success(
                            this.i18n(`Created {created} {translations|plural:1:translation:default:translations} ({updated} updated).`, {
                                created: <strong>{response.getData('inserted')}</strong>,
                                translations: response.getData('inserted'),
                                updated: <strong>{response.getData('ignored')}</strong>
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
                                            validate="required"
                                            name="apps"
                                            label={this.i18n('Select apps to scan for texts')}
                                            api="/services/webiny/apps"
                                            url="/installed"
                                            textAttr="name"
                                            valueAttr="name"/>
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