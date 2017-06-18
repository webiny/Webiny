import Webiny from 'Webiny';
import styles from './styles.css';

class Switch extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.bindMethods('switch');
    }

    componentWillMount() {
        super.componentWillMount();
        this.id = _.uniqueId('switch-');
    }

    switch() {
        if (this.isDisabled()) {
            return;
        }
        const el = ReactDOM.findDOMNode(this).querySelector('input');
        const checked = !el.checked;
        this.props.onChange(checked);
    }
}

Switch.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    style: {},
    renderer() {
        const {FormGroup, styles} = this.props;
        let classes = this.classSet(styles.switch, styles.switchInline);
        if (this.props.disabled) {
            classes += ' ' + styles.disabled;
        }

        return (
            <FormGroup>
                {this.renderLabel()}
                <div className="clearfix"/>
                <div className={classes}>
                    <input id={this.id} type="checkbox" readOnly checked={this.props.value === true}/>
                    <label htmlFor={this.id} onClick={this.switch}/>
                </div>
                {this.renderDescription()}
            </FormGroup>
        );
    }
});

export default Webiny.createComponent(Switch, {modules: ['FormGroup'], styles});
