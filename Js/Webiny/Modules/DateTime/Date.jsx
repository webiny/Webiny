import BaseDateTime from './Base';

class Date extends BaseDateTime {

    setValue(newValue) {
        newValue = moment(newValue, this.props.modelFormat);
        newValue = newValue.isValid() ? newValue.format(this.props.inputFormat) : '';

        super.setValue(newValue);
    }

    onChange(e) {
        let newValue = e.target.value;
        setTimeout(() => {
            const widget = ReactDOM.findDOMNode(this).querySelector('.bootstrap-datetimepicker-widget');
            if (!widget) {

                if (newValue) {
                    const format = this.props.withTimezone ? 'YYYY-MM-DDTHH:mm:ssZ' : this.props.modelFormat;
                    newValue = moment(newValue, this.props.modelFormat).format(format);
                }
                this.props.valueLink.requestChange(newValue);
            }
        }, 1);
    }
}

Date.defaultProps = _.merge({}, BaseDateTime.defaultProps, {
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'YYYY-MM-DD',
    modelFormat: 'YYYY-MM-DD',
    viewMode: 'days',
    withTimezone: false
});

export default Date;
