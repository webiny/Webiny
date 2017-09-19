import React from 'react';
import Webiny from 'webiny';
import TranslationsModal from './TextsList/TextsModal';
import ScanTextsModal from './TextsList/ScanTextsModal';
import ImportTextsModal from './TextsList/ImportTextsModal';

/**
 * @i18n.namespace Webiny.Backend.I18N.TextsList
 */
class TextsList extends Webiny.Ui.View {
}

TextsList.defaultProps = {
    renderer () {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'View', 'Button', 'Icon', 'List', 'Input', 'Link', 'Grid', 'Select']}>
                {Ui => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="translationsList" defaultView>
                            {showView => (
                                <Ui.View.List>
                                    <Ui.View.Header title={this.i18n(`Texts`)}>
                                        <Ui.Button
                                            type="primary"
                                            align="right"
                                            onClick={showView('scanTextsModal')}
                                            icon="icon-cloud-download"
                                            label={this.i18n(`Scan`)}/>
                                        <Ui.Button
                                            type="primary"
                                            align="right"
                                            onClick={showView('importTextsModal')}
                                            icon="icon-cloud-download"
                                            label={this.i18n(`Import`)}/>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            connectToRouter
                                            title={this.i18n(`Translations`)}
                                            api="/entities/webiny/i18n-texts"
                                            searchFields="key,placeholder,app"
                                            fields="key,placeholder,app,translations"
                                            sort="-createdOn">
                                            <Ui.List.FormFilters>
                                                {(apply) => (
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Input
                                                                name="_searchQuery"
                                                                placeholder="Search by method or URL"
                                                                onEnter={apply()}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={3}>
                                                            <Ui.Select
                                                                api="/entities/webiny/api-logs/methods"
                                                                name="method"
                                                                placeholder="Filter by HTTP method"
                                                                allowClear
                                                                onChange={apply()}/>
                                                        </Ui.Grid.Col>
                                                    </Ui.Grid.Row>
                                                )}
                                            </Ui.List.FormFilters>
                                            <Ui.List.Table>
                                                <Ui.List.Table.Row>
                                                    <Ui.List.Table.Field label={this.i18n('Text')} align="left">
                                                        {row => (
                                                            <span onClick={() => showView('textModal')(row)}>
                                                                <strong>{row.key}</strong><br/>
                                                                <small>{row.placeholder}</small>
                                                            </span>
                                                        )}
                                                    </Ui.List.Table.Field>
                                                    <Ui.List.Table.Actions>
                                                        <Ui.List.Table.Action label="Edit" onClick={showView('translationModal')}/>
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
                        <Ui.ViewSwitcher.View view="translationModal" modal>
                            {(showView, data) => (
                                <TranslationsModal {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="scanTextsModal" modal>
                            {(showView, data) => (
                                <ScanTextsModal {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="importTextsModal" modal>
                            {(showView, data) => (
                                <ImportTextsModal {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default TextsList;