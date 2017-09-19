import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

/**
 * @i18n.namespace Webiny.Backend.I18N.ExportTextsModal
 */
class ExportTextsModal extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title={this.i18n(`Export texts`)} onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Form.Error/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.CheckboxGroup
                                            validate="required"
                                            name="apps"
                                            label={this.i18n('Select apps to export')}
                                            api="/services/webiny/apps"
                                            url="/installed"
                                            textAttr="name"
                                            valueAttr="name"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer >
                                <Ui.Button label={this.i18n(`Cancel`)} onClick={this.hide}/>
                                <Ui.DownloadLink
                                    separate
                                    disabled={_.isEmpty(model.apps)}
                                    onClick={() => this.hide()}
                                    method="POST"
                                    params={{import: model.import, apps: model.apps}}
                                    type="primary"
                                    download={Webiny.Config.ApiPath + '/entities/webiny/i18n-texts/export'}>
                                    {this.i18n(`Export`)}
                                </Ui.DownloadLink>
                            </Ui.Modal.Footer>
                        </Ui.Modal.Content>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

ExportTextsModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps);

export default Webiny.createComponent(ExportTextsModal, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'CheckboxGroup', 'Checkbox', 'Button', 'DownloadLink'
    ]
});