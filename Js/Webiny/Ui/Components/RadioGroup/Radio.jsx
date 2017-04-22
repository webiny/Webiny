import Webiny from 'Webiny';
import styles from './styles.css';

class Radio extends Webiny.Ui.Component {

    constructor() {
        super();

        this.bindMethods('onChange,isChecked');
    }

    componentWillMount() {
        super.componentWillMount();
        this.id = _.uniqueId('radio-');
    }

    onChange() {
        this.props.onChange(this.props.value);
    }

    isChecked() {
        return this.props.checked;
    }


    shouldComponentUpdate(props) {
        let update = super.shouldComponentUpdate(props);

        if (!update) {
            const keys = [
                'state',
                'stateKey'
            ];

            keys.forEach(key => {
                if (_.get(this.props, key) !== _.get(props, key)) {
                    update = true;
                }
            });
        }

        return update;
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
                <input type="radio" disabled={this.props.disabled} onChange={this.onChange} checked={this.isChecked()} id={this.id}/>
                <label htmlFor={this.id}>{this.props.label}</label>
            </div>
        );
    }
};

export default Webiny.createComponent(Radio, {styles});