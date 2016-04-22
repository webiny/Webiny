import BaseDateTime from './Base';

class DateTime extends BaseDateTime {

}

DateTime.defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: moment.ISO_8601,
    minDate: false,
    component: 'datetime',
    renderer: BaseDateTime.defaultProps.renderer
};

export default DateTime;
