import Webiny from 'Webiny';

class Textarea extends Webiny.Ui.Component {

    onChange(e) {
        this.props.valueLink.requestChange(e.target.value);
    }
}

Textarea.defaultProps = {
    renderer() {
        const props = _.omit(this.props, 'valueLink');
        props.value = this.props.valueLink.value || '';
        props.onChange = this.onChange.bind(this);
        return <textarea {...props}/>;
    }
};

export default Textarea;