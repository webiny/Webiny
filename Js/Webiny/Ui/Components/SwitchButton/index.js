import Webiny from 'Webiny';
import styles from './styles.css';

class SwitchButton extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('switch');
    }

    componentWillMount() {
        super.componentWillMount();
        this.id = _.uniqueId('switch-');
    }

    switch() {
        if (this.props.disabled) {
            return;
        }
        const el = ReactDOM.findDOMNode(this).querySelector('input');
        const checked = !el.checked;
        this.props.onChange(checked);
    }
}

SwitchButton.defaultProps = {
    value: false,
    onChange: _.noop,
    style: {},
    disabled: false,
    renderer() {
        const {styles} = this.props;
        const value = this.props.value || null;
        let classes = this.classSet(styles.switch, styles.switchInline);
        if (this.props.disabled) {
            classes += ' ' + styles.disabled;
        }

        return (
            <div style={this.props.style} className={classes}>
                <input id={this.id} type="checkbox" readOnly checked={value === true}/>
                <label htmlFor={this.id} onClick={this.switch}/>
            </div>
        );
    }
};

export default Webiny.createComponent(SwitchButton, {styles});
