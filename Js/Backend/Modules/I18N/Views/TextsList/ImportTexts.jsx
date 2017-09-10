import React from 'react';
import Webiny from 'webiny';

class ImportTexts extends Webiny.Ui.ModalComponent {
    constructor() {
        super();
        this.i18n.key = 'Webiny.Backend.I18N.ImportTexts';
    }

    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form api="/entities/webiny/i18n-texts">
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title="Scan Texts" onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer >
                                <Ui.Button label={this.i18n(`Cancel`)} onClick={this.hide}/>
                                <Ui.Button
                                    renderIf={!model.download}
                                    disabled={!this.canSubmit(model)}
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

export default Webiny.createComponent(ImportTexts, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'CheckboxGroup', 'Checkbox', 'Button', 'Section', 'DownloadLink'
    ]
});