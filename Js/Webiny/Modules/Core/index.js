import Webiny from 'Webiny';
import Cookies from 'js-cookie';
import WebinyModule from './Core/Module';
import App from './Core/App';
import Component from './Core/Component';
import FormComponent from './Core/FormComponent';
import OptionComponent from './Core/OptionComponent';
import ModalComponent from './Core/ModalComponent';
import ApiComponent from './Core/ApiComponent';
import Model from './Core/Model';
import View from './Core/View';
import Menu from './Core/Menu';
import Dispatcher from './Core/Dispatcher';
import UiDispatcher from './Core/UiDispatcher';
import Injector from './Core/Injector';
import ViewManager from './Core/ViewManager';
import Router from './Router/Router';
import Route from './Router/Route';
import Http from './Http/Http';
import Tools from './Tools';
import i18n from './i18n/i18n';
import Endpoint from './Api/Endpoint';
import Placeholder from './Ui/Placeholder';
import RootElement from './Ui/RootElement';
import UiMenu from './Ui/Menu';

_.merge(Webiny, {
    App,
    Base: {},
    Menu,
    Module: WebinyModule,
    Mixins: {
        ApiComponent
    },
    Ui: {
        Placeholder,
        Component,
        Components: {
            Filters: {}
        },
        Dispatcher: UiDispatcher,
        FormComponent,
        ModalComponent,
        OptionComponent,
        Menu: UiMenu,
        View,
        Views: {}
    },
    Model,
    RootElement,
    Router,
    Route,
    ViewManager,
    Dispatcher,
    Injector,
    Tools,
    i18n,
    Cookies, // from js-cookies
    Http,
    Api: {
        Endpoint
    }
});
