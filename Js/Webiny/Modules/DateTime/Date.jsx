import BaseDateTime from './Base';

class Date extends BaseDateTime {

}

Date.defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD',
    modelFormat: 'YYYY-MM-DD',
    component: 'date',
    viewMode: 'days'
};

export default Date;
