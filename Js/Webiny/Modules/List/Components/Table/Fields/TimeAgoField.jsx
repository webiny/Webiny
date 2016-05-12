import Field from './../Field';

class TimeAgoField extends Field {

}

TimeAgoField.defaultProps = _.merge({}, Field.defaultProps, {
    renderer() {
        return (
            <td className={this.getTdClasses()}>{moment(this.props.data[this.props.name]).fromNow()}</td>
        );
    }
});

export default TimeAgoField;