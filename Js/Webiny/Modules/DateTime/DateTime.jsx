import BaseDateTime from './Base';

class DateTime extends BaseDateTime {

}

DateTime.defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DDTHH:mm:ssZ',
    minDate: false,
    showTime: true,
    component: 'datetime',
    renderer: BaseDateTime.defaultProps.renderer
};

export default DateTime;
