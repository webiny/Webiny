import BaseDateTime from './Base';

class Time extends BaseDateTime {

}

Time.defaultProps = {
	disabled: false,
    readOnly:false,
	placeholder: '',
    inputFormat: 'HH:mm',
    modelFormat: 'HH:mm:ss',
    component: 'time',
	stepping: 15
};

export default Time;
