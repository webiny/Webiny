import Webiny from 'Webiny';

export default () => {
    Webiny.registerModule({
        'Core/Webiny/Vendors/Accounting': () => import('./Accounting'),
        'Core/Webiny/Vendors/C3': () => import('./C3'),
        'Core/Webiny/Vendors/CodeMirror': () => import('./CodeMirror'),
        'Core/Webiny/Vendors/Cropper': () => import('./Cropper'),
        'Core/Webiny/Vendors/DateTimePicker': () => import('./DateTimePicker'),
        'Core/Webiny/Vendors/Draft': () => import('./Draft'),
        'Core/Webiny/Vendors/Highlight': () => import('./Highlight'),
        'Core/Webiny/Vendors/OwlCarousel': () => import('./OwlCarousel'),
        'Core/Webiny/Vendors/Quill': () => import('./Quill'),
        'Core/Webiny/Vendors/Select2': () => import('./Select2')
    });
};