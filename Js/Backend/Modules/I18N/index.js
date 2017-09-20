import Webiny from 'webiny';
import Views from './Views/Views';
import React from 'react';

class Module extends Webiny.App.Module {
    init() {
        this.name = 'I18N';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="I18N" icon="icon-earth" role="webiny-i18n-manager">
                <Menu label="Locales" route="I18N.Locales.List"/>
                <Menu label="Texts">
                    <Menu label="Translations" route="I18N.Translations.List"/>
                    <Menu label="Text Groups" route="I18N.TextGroups.List"/>
                    <Menu label="Texts" route="I18N.Texts.List"/>
                </Menu>
            </Menu>
        );


        this.registerRoutes(
            new Webiny.Route('I18N.Locales.List', '/i18n/locales', Views.LocalesList, 'I18N - List Locales'),
            new Webiny.Route('I18N.Texts.List', '/i18n/texts', Views.TextsList, 'I18N - List Texts'),
            new Webiny.Route('I18N.TextGroups.List', '/i18n/text-groups', Views.TextGroupsList, 'I18N - List Text Groups'),
            new Webiny.Route('I18N.Translations.List', '/i18n/translations', Views.TranslationsList, 'I18N - List Translations')
        );
    }
}

export default Module;