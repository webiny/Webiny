import Webiny from 'webiny';
import Views from './Views/Views';
import React from 'react';

class Module extends Webiny.App.Module {
    init() {
        this.name = 'I18N';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            <Menu label="I18N" icon="icon-tools" role="webiny-i18n-manager">
                <Menu label="Locales" route="I18N.Locales.List"/>
                <Menu label="Texts" route="I18N.Texts.List"/>
            </Menu>
        );


        this.registerRoutes(
            new Webiny.Route('I18N.Texts.List', '/i18n/texts', Views.TextsList, 'I18N - List Texts'),
            new Webiny.Route('I18N.Locales.List', '/i18n/locales', Views.LocalesList, 'I18N - List Locales')
        );
    }
}

export default Module;