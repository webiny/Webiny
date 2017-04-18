import Webiny from 'Webiny';
import Cookies from 'js-cookie';
import WebinyModule from './Core/Module';
import App from './Core/App';
import Draft from './Draft';
import Component from './Core/Component';
import FormComponent from './Core/FormComponent';
import OptionComponent from './Core/OptionComponent';
import ModalComponent from './Core/ModalComponent';
import Uploader from './Api/Uploader';
import ApiComponent from './Core/ApiComponent';
import Model from './Core/Model';
import View from './Core/View';
import Menu from './Core/Menu';
import Dispatcher from './Core/Dispatcher';
import UiDispatcher from './Core/UiDispatcher';
import Injector from './Core/Injector';
import ViewManager from './Core/ViewManager';
import Filter from './Core/Filter';
import Growl from './Core/Growl';
import Router from './Router/Router';
import Route from './Router/Route';
import Http from './Http/Http';
import i18n from './i18n/i18n';
import Endpoint from './Api/Endpoint';
import Placeholder from './Ui/Placeholder';
import RootElement from './Ui/RootElement';
import UiMenu from './Ui/Menu';
import createComponent from './createComponent';
import LazyLoad from './Ui/LazyLoad';
import Validator from './Validation/Validator';

_.merge(Webiny, {
    Api: {
        Uploader,
        Endpoint
    },
    App,
    Base: {},
    createComponent,
    Cookies, // from js-cookies
    Draft,
    Dispatcher,
    Filter,
    Growl,
    Http,
    Injector,
    i18n,
    Menu,
    Mixins: {
        ApiComponent
    },
    Model,
    Module: WebinyModule,
    Router,
    Route,
    RootElement,
    Ui: {
        LazyLoad,
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
    Validator,
    ViewManager
});
