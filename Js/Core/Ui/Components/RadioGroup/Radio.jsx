import Webiny from 'Webiny';
import styles from './styles.css';

class Radio extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.id = _.uniqueId('radio-');
        this.bindMethods('onChange');
    }

    onChange() {
        this.props.onChange(this.props.value);
    }
}

Radio.defaultProps = {
    disabled: false,
    label: '',
    className: '',
    renderer() {
        const css = this.classSet(this.props.styles.radio, this.props.className, 'col-sm-' + this.props.grid);

        return (
            <div className={css}>
                <input type="radio" disabled={this.props.disabled} onChange={this.onChange} checked={this.props.checked} id={this.id}/>
                <label htmlFor={this.id}>{this.props.label}</label>
            </div>
        );
    }
};

export default Webiny.createComponent(Radio, {styles});