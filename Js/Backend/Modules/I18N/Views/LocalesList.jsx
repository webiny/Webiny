import React from 'react';
import Webiny from 'webiny';
import AddLocaleModal from './LocalesList/AddLocaleModal';

class LocalesList extends Webiny.Ui.View {
    constructor() {
        super();
        this.addLocaleModal = null;
        this.localesList = null;
    }
}

LocalesList.defaultProps = {
    renderer: function render() {
        return (
            <Webiny.Ui.LazyLoad modules={['View', 'List', 'Icon', 'Button']}>
                {Ui => (
                    <Ui.View.List>
                        <Ui.View.Header title="I18N - Locales">
                            <Ui.Button type="primary" align="right" onClick={() => this.addLocaleModal.show()}>
                                <Ui.Icon icon="icon-plus-circled"/>
                                Add Locale
                            </Ui.Button>
                            <AddLocaleModal
                                ref={ref => this.addLocaleModal = ref}
                                onSuccessMessage={null}
                                onSubmitSuccess={apiResponse => {
                                    this.localesList.loadData();
                                    Webiny.Growl.success(this.i18n('Locale {locale} was successfully added!', {
                                        locale: <strong>{apiResponse.getData('entity.label')}</strong>
                                    }));
                                }}/>
                        </Ui.View.Header>
                        <Ui.View.Body>
                            <Ui.List
                                connectToRouter
                                api="/entities/webiny/i18n-locales"
                                fields="id,enabled,label,key"
                                searchFields="id,key"
                                ref={ref => this.localesList = ref}>
                                <Ui.List.Table>
                                    <Ui.List.Table.Row>
                                        <Ui.List.Table.Field label="Locale">
                                            {row => row.label}
                                        </Ui.List.Table.Field>
                                        <Ui.List.Table.ToggleField name="enabled" label="Status" align="center"/>
                                        <Ui.List.Table.DateField name="createdOn" label="Created On" sort="createdOn"/>
                                        <Ui.List.Table.Actions>
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
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default LocalesList;