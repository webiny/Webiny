import Webiny from 'Webiny';

class Textarea extends Webiny.Ui.Component {

    onChange(e) {
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(e.target.value);
        } else {
            this.props.onChange(e);
        }
    }
}

Textarea.defaultProps = {
    renderer() {
        const props = _.omit(this.props, 'valueLink');
        props.value = _.has(this.props, 'valueLink') ? _.get(this.props, 'valueLink.value') || '' : this.props.value || '';
        props.onChange = this.onChange.bind(this);
        return <textarea {...props}/>;
    }
};

export default Textarea;