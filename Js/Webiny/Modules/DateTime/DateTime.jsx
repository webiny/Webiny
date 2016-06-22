import DateComponent from './Date';

class DateTime extends DateComponent {

    onChange(e) {
        let newValue = e.target.value;
        setTimeout(() => {
            const widget = ReactDOM.findDOMNode(this).querySelector('.bootstrap-datetimepicker-widget');
            if (!widget) {
                if (newValue) {
                    newValue = moment(newValue, this.props.modelFormat).format(this.props.modelFormat);
                }
                this.props.valueLink.requestChange(newValue);
            }
        }, 1);
    }
}

DateTime.defaultProps = _.merge({}, DateComponent.defaultProps, {
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DDTHH:mm:ssZ'
});

export default DateTime;
