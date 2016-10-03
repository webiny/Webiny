import DateComponent from './Date';

class DateTime extends DateComponent {

    onChange(newValue) {
        if (newValue) {
            newValue = moment(newValue, this.props.inputFormat).format(this.props.modelFormat);
        }

        if (newValue !== this.props.value) {
            this.props.onChange(newValue, this.validate);
        }
    }
}

DateTime.defaultProps = _.merge({}, DateComponent.defaultProps, {
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DDTHH:mm:ssZ'
});

export default DateTime;
