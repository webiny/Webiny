import React from 'react';
import Webiny from 'webiny';
import TranslationsModal from './TextsList/TextsModal';
import ScanTexts from './TextsList/ScanTexts';
import ImportTexts from './TextsList/ImportTexts';

class TextsList extends Webiny.Ui.View {
}

TextsList.defaultProps = {
    i18nNamespace : 'Webiny.Backend.I18N.TextsList',
    renderer () {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'View', 'Button', 'Icon', 'List', 'Input', 'Link']}>
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
                                            label={this.i18n(`Import Texts`)}/>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            connectToRouter
                                            title={this.i18n(`Translations`)}
                                            api="/entities/webiny/i18n-texts"
                                            searchFields="key,placeholder,app"
                                            fields="key,placeholder,app,translations"
                                            sort="-createdOn"
                                            ui="textList">
                                            <Ui.List.FormFilters>
                                                {applyFilters => (
                                                    <Ui.Input
                                                        placeholder="Search"
                                                        name="_searchQuery"
                                                        onEnter={applyFilters()}/>
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
                                <ScanTexts {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="importTextsModal" modal>
                            {(showView, data) => (
                                <ImportTexts {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default TextsList;