import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

/**
 * @i18n.namespace Webiny.Backend.I18N.ImportTexts
 */
class ImportTextsModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form 
                    api="/entities/webiny/i18n-texts"
                    url="/import"
                    onSuccessMessage={model => (
                        this.i18n(`Inserted {inserted|plural:1:translation:default:translations} ({ignored} ignored).`, {
                            inserted: model.inserted,
                            ignored: model.ignored
                        })
                    )}
                    onSubmitSuccess={async () => {
                        await this.hide();
                        this.props.onTextsScanned();
                    }}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title={this.i18n(`Import Texts`)} onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Form.Error/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.File
                                            validate="required"
                                            placeholder={this.i18n('ZIP or JSON file')}
                                            label={this.i18n('Choose File')}
                                            name="file"
                                            accept={['application/zip']}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer >
                                <Ui.Button label={this.i18n(`Cancel`)} onClick={this.hide}/>
                                <Ui.Button
                                    type="primary"
                                    label={this.i18n(`Import`)}
                                    onClick={form.submit}/>
                            </Ui.Modal.Footer>
                        </Ui.Modal.Content>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

ImportTextsModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps);

export default Webiny.createComponent(ImportTextsModal, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'CheckboxGroup', 'Checkbox', 'Button', 'File'
    ]
});