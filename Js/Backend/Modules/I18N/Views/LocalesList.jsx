import React from 'react';
import Webiny from 'webiny';
import LocalesModal from './LocalesList/LocalesModal';

/**
 * @i18n.namespace Webiny.Backend.I18N.LocalesList
 */
class LocalesList extends Webiny.Ui.View {
    constructor() {
        super();
        this.localesModal = null;
        this.localesList = null;
    }
}

LocalesList.defaultProps = {
    renderer: function render() {
        return (
            <Webiny.Ui.LazyLoad modules={['View', 'List', 'Icon', 'Button', 'ViewSwitcher']}>
                {Ui => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="translationsList" defaultView>
                            {showView => (
                                <Ui.View.List>
                                    <Ui.View.Header title="I18N - Locales">
                                        <Ui.Button type="primary" align="right" onClick={showView('localesModal')}>
                                            <Ui.Icon icon="icon-plus-circled"/>
                                            Add Locale
                                        </Ui.Button>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            connectToRouter
                                            api="/entities/webiny/i18n-locales"
                                            fields="id,enabled,default,label,key,createdOn"
                                            searchFields="id,key"
                                            ref={ref => this.localesList = ref}>
                                            <Ui.List.Table>
                                                <Ui.List.Table.Row>
                                                    <Ui.List.Table.Field label="Locale" sort="key">
                                                        {row => (
                                                            <div>
                                                                <div>{this.i18n().money(12345.78)}</div>
                                                                <div>{this.i18n().number(12345.78)}</div>
                                                                <div>{this.i18n('{broj|number}', {broj: 5699.99})}</div>
                                                                <div>{this.i18n('{pare|money}', {pare: 5699.99})}</div>
                                                                <div>{row.label}</div>
                                                                <code>{row.key}</code>
                                                            </div>
                                                        )}
                                                    </Ui.List.Table.Field>
                                                    <Ui.List.Table.ToggleField name="enabled" label="Enabled" sort="enabled" align="center"/>
                                                    <Ui.List.Table.ToggleField name="default" label="Default" sort="default" align="center"/>
                                                    <Ui.List.Table.DateField name="createdOn" label="Created On" sort="createdOn" align="center"/>
                                                    <Ui.List.Table.Actions>
                                                        <Ui.List.Table.EditAction onClick={showView('localesModal')}/>
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
                        <Ui.ViewSwitcher.View view="localesModal" modal>
                            {(showView, data) => (
                                <LocalesModal {...{showView, data}} onSubmitSuccess={() => this.localesList.loadData()}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>

                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default LocalesList;