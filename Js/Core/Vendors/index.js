import Webiny from 'Webiny';

export default () => {
    Webiny.registerModule({
        'Webiny/Core/Vendors/Accounting': () => import('./Accounting'),
        'Webiny/Core/Vendors/C3': () => import('./C3'),
        'Webiny/Core/Vendors/CodeMirror': () => import('./CodeMirror'),
        'Webiny/Core/Vendors/Cropper': () => import('./Cropper'),
        'Webiny/Core/Vendors/DateTimePicker': () => import('./DateTimePicker'),
        'Webiny/Core/Vendors/Draft': () => import('./Draft'),
        'Webiny/Core/Vendors/Highlight': () => import('./Highlight'),
        'Webiny/Core/Vendors/OwlCarousel': () => import('./OwlCarousel'),
        'Webiny/Core/Vendors/Quill': () => import('./Quill'),
        'Webiny/Core/Vendors/Select2': () => import('./Select2')
    });
};