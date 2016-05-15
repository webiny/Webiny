import BaseDateTime from './Base';

class DateTime extends BaseDateTime {

}

DateTime.defaultProps = _.merge({}, BaseDateTime.defaultProps, {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DDTHH:mm:ssZ',
    minDate: false,
    component: 'datetime'
});

export default DateTime;
