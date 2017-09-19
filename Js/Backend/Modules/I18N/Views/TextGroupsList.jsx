import React from 'react';
import Webiny from 'webiny';
import TextGroupsModal from './TextGroupsList/TextGroupsModal';

/**
 * @i18n.namespace Webiny.Backend.I18N.TextGroupsList
 */
class TextGroupsList extends Webiny.Ui.View {
    constructor() {
        super();
        this.ref = null;
    }
}

TextGroupsList.defaultProps = {
    renderer () {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'View', 'Button', 'List']}>
                {Ui => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="textGroupsList" defaultView>
                            {showView => (
                                <Ui.View.List>
                                    <Ui.View.Header title={this.i18n(`Text Groups`)}>
                                        <Ui.Button
                                            type="primary"
                                            align="right"
                                            onClick={showView('textGroupsModal')}
                                            icon="icon-cloud-download"
                                            label={this.i18n(`Create text group`)}/>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            ref={ref => this.ref = ref}
                                            connectToRouter
                                            title={this.i18n(`Text Groups`)}
                                            api="/entities/webiny/i18n-text-groups"
                                            fields="name,totalTexts"
                                            sort="-createdOn">
                                            <Ui.List.Table>
                                                <Ui.List.Table.Row>
                                                    <Ui.List.Table.Field name="name" label={this.i18n('Name')}/>
                                                    <Ui.List.Table.Field name="totalTexts" label={this.i18n('Total Texts')} align="center"/>
                                                    <Ui.List.Table.Actions>
                                                        <Ui.List.Table.EditAction onClick={showView('textGroupsModal')}/>
                                                        <Ui.List.Table.DeleteAction/>
                                                    </Ui.List.Table.Actions>
                                                </Ui.List.Table.Row>
                                                <Ui.List.Table.Footer/>
                                            </Ui.List.Table>
                                            <Ui.List.Pagination/>
                                        </Ui.List>
                                    </Ui.View.Body>
                                </Ui.View.List>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="textGroupsModal" modal>
                            {(showView, data) => (
                                <TextGroupsModal {...{showView, data}} onSubmitSuccess={() => this.ref.loadData()}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default TextGroupsList;