import BaseDateTime from './Base';

class Date extends BaseDateTime {

}

Date.defaultProps = _.merge({}, BaseDateTime.defaultProps, {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD',
    modelFormat: 'YYYY-MM-DD',
    component: 'date',
    viewMode: 'days',
    withTimezone: false,
    renderer: BaseDateTime.defaultProps.renderer
});

export default Date;
