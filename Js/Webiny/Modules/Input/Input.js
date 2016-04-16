import Webiny from 'Webiny';

class Input extends Webiny.Ui.Component {

    onChange(e) {
        this.props.valueLink.requestChange(e.target.value);
    }

    render() {
        const props = _.omit(this.props, 'valueLink');
        props.value = this.props.valueLink.value || '';
        props.onChange = this.onChange.bind(this);
        return <input {...props}/>;
    }
}

export default Input;
