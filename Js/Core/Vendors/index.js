import Webiny from 'Webiny';

export default () => {
    Webiny.registerModule(
        new Webiny.Module('Webiny/Core/Vendors/Accounting', () => import('./Accounting')),
        new Webiny.Module('Webiny/Core/Vendors/C3', () => import('./C3')),
        new Webiny.Module('Webiny/Core/Vendors/CodeMirror', () => import('./CodeMirror')),
        new Webiny.Module('Webiny/Core/Vendors/Cropper', () => import('./Cropper')),
        new Webiny.Module('Webiny/Core/Vendors/DateTimePicker', () => import('./DateTimePicker')),
        new Webiny.Module('Webiny/Core/Vendors/Draft', () => import('./Draft')),
        new Webiny.Module('Webiny/Core/Vendors/Highlight', () => import('./Highlight')),
        new Webiny.Module('Webiny/Core/Vendors/OwlCarousel', () => import('./OwlCarousel')),
        new Webiny.Module('Webiny/Core/Vendors/Quill', () => import('./Quill')),
        new Webiny.Module('Webiny/Core/Vendors/Select2', () => import('./Select2'))
    );
};