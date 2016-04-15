import Webiny from 'Webiny';

class Radio extends Webiny.Ui.FormComponent {

    constructor() {
        super();

        this.bindMethods('onChange,isChecked');
    }

    componentWillMount() {
        super.componentWillMount();
        this.id = Webiny.Tools.createUID();
    }

    onChange() {
        this.props.onChange(this.props.stateKey);
    }

    isChecked() {
        let state = this.props.stateKey;

        if (state === 'false') {
            state = false;
        } else if (state === 'true') {
            state = true;
        }

        return state === this.props.state;
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
    renderer: function renderer() {
        let state = this.props.stateKey;

        if (state === 'false') {
            state = false;
        } else if (state === 'true') {
            state = true;
        }

        const checked = state === this.props.state;
        const css = this.classSet('radio-custom mt10', this.props.className, 'col-sm-' + this.props.grid);

        return (
            <div className={css}>
                <input type="radio" disabled={this.props.disabled} onChange={this.onChange} checked={checked} id={this.id}/>
                <label htmlFor={this.id}>{this.props.label}</label>
            </div>
        );
    }
};

export default Radio;