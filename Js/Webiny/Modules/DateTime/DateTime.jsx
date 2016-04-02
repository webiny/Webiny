import BaseDateTime from './Base';

class DateTime extends BaseDateTime {

}

DateTime.defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DD HH:mm:ss',
    minDate: false,
    component: 'datetime'
};

export default DateTime;
