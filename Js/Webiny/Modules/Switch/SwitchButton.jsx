import Webiny from 'Webiny';

class SwitchButton extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('switch');
    }

    componentWillMount() {
        super.componentWillMount();
        this.id = Webiny.Tools.createUID();
    }

    switch() {
        const el = ReactDOM.findDOMNode(this).querySelector('input');
        const checked = !el.checked;
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(checked);
        } else {
            if (this.props.onChange) {
                this.props.onChange(checked);
            }
        }
    }
}

SwitchButton.defaultProps = {
    style: {},
    renderer() {
        let value = this.props.value || null;
        if (this.props.valueLink) {
            value = this.props.valueLink.value;
        }
        let classes = this.classSet('switch switch--inline');
        if (this.props.disabled) {
            classes += ' disabled';
        }

        return (
            <div style={this.props.style} className={classes}>
                <input id={this.id} type="checkbox" readOnly checked={value === true}/>
                <label htmlFor={this.id} onClick={this.switch}></label>
            </div>
        );
    }
};

export default SwitchButton;
