import React from 'react';
import Webiny from 'webiny';
import TextsModal from './TextsList/TextsModal';
import ScanTextsModal from './TextsList/ScanTextsModal';
import ImportTextsModal from './TextsList/ImportTextsModal';

/**
 * @i18n.namespace Webiny.Backend.I18N.TextsList
 */
class TextsList extends Webiny.Ui.View {
    constructor() {
        super();
        this.ref = null;
    }
}

TextsList.defaultProps = {
    renderer () {
        return (
            <Webiny.Ui.LazyLoad
                modules={['ViewSwitcher', 'View', 'Button', 'ButtonGroup', 'Icon', 'List', 'Input', 'Link', 'Grid', 'Select']}>
                {Ui => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="translationsList" defaultView>
                            {showView => (
                                <Ui.View.List>
                                    <Ui.View.Header
                                        title={this.i18n(`Texts`)}
                                        description={this.i18n('Scan, create or manage existing texts in all installed apps.')}>
                                        <Ui.ButtonGroup>
                                            <Ui.Button
                                                type="primary"
                                                onClick={showView('textsModal')}
                                                icon="icon-plus-circled"
                                                label={this.i18n(`Create`)}/>
                                            <Ui.Button
                                                type="secondary"
                                                onClick={showView('importTextsModal')}
                                                icon="fa-download"
                                                label={this.i18n(`Import`)}/>
                                            <Ui.Button
                                                type="secondary"
                                                onClick={showView('exportTextsModal')}
                                                icon="fa-upload"
                                                label={this.i18n(`Export`)}/>
                                            <Ui.Button
                                                type="secondary"
                                                icon="icon-arrow-circle-right"
                                                onClick={showView('scanTextsModal')}
                                                label={this.i18n(`Scan`)}/>
                                        </Ui.ButtonGroup>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            ref={ref => this.ref = ref}
                                            connectToRouter
                                            title={this.i18n(`Translations`)}
                                            api="/entities/webiny/i18n-texts"
                                            searchFields="key,base"
                                            fields="key,base,app,translations,textGroup,createdOn"
                                            sort="-createdOn">
                                            <Ui.List.FormFilters>
                                                {(apply) => (
                                                    <Ui.Grid.Row>
                                                        <Ui.Grid.Col all={4}>
                                                            <Ui.Input
                                                                name="_searchQuery"
                                                                placeholder="Search by text key or base text"
                                                                onEnter={apply()}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={4}>
                                                            <Ui.Select
                                                                name="app"
                                                                api="/services/webiny/apps"
                                                                url="/installed"
                                                                textAttr="name"
                                                                valueAttr="name"
                                                                placeholder="Filter by app"
                                                                allowClear
                                                                onChange={apply()}/>
                                                        </Ui.Grid.Col>
                                                        <Ui.Grid.Col all={4}>
                                                            <Ui.Select
                                                                api="/entities/webiny/i18n-text-groups"
                                                                name="textGroup"
                                                                placeholder="Filter by text group"
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
                                                                <small>{row.base}</small>
                                                            </span>
                                                        )}
                                                    </Ui.List.Table.Field>
                                                    <Ui.List.Table.Field name="app" label={this.i18n('App')} align="center"/>
                                                    <Ui.List.Table.Field name="textGroup.name" label={this.i18n('Group')} align="center"/>
                                                    <Ui.List.Table.Actions>
                                                        <Ui.List.Table.Action label="Edit" onClick={showView('textsModal')}/>
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
                        <Ui.ViewSwitcher.View view="textsModal" modal>
                            {(showView, data) => (
                                <TextsModal {...{showView, data}} onSubmitSuccess={() => this.ref.loadData()}/>
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