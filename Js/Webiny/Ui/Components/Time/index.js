import Webiny from 'Webiny';

class Time extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);
        this.valueChanged = false;

        this.bindMethods('setValue,setup');
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps['disabledBy']) {
            return true;
        }

        const omit = ['children', 'key', 'ref', 'onChange'];
        const oldProps = _.omit(this.props, omit);
        const newProps = _.omit(nextProps, omit);

        return !_.isEqual(newProps, oldProps) || !_.isEqual(nextState, this.state);
    }

    /**
     * Initialize DateTimePicker
     * @url https://eonasdan.github.io/bootstrap-datetimepicker/
     */
    componentDidMount() {
        super.componentDidMount();
        this.getInput().then(this.setup);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.setValue(this.props.value);
    }

    getInput() {
        if (this.input) {
            return Promise.resolve(this.input);
        }

        return new Promise(resolve => {
            let interval = setInterval(() => {
                const dom = ReactDOM.findDOMNode(this);
                if (dom) {
                    clearInterval(interval);
                    interval = null;
                    this.input = $(dom.querySelector('input'));
                    resolve(this.input);
                }
            }, 100);
        });
    }

    setup() {
        this.input.datetimepicker({
            format: this.props.inputFormat,
            stepping: this.props.stepping,
            keepOpen: false,
            debug: this.props.debug || false,
            minDate: this.props.minDate ? new Date(this.props.minDate) : false,
            widgetPositioning: {
                horizontal: this.props.positionHorizontal || 'auto',
                vertical: this.props.positionVertical || 'bottom'
            }
        }).on('dp.hide', e => {
            if (this.valueChanged) {
                this.onChange(e.target.value);
            }
            this.valueChanged = false;
        }).on('dp.change', () => {
            this.valueChanged = true;
        });

        this.setValue(this.props.value);
    }

    setValue(newValue) {
        this.getInput().then(() => {
            this.input.val(newValue);

            if (this.props.minDate) {
                this.input.data('DateTimePicker').minDate(new Date(this.props.minDate));
            }
        });
    }

    onChange(value) {
        this.props.onChange(value, this.validate);
    }
}

Time.defaultProps = {
    onChange: _.noop,
    debug: false,
    disabled: false,
    readOnly: false,
    placeholder: '',
    inputFormat: 'HH:mm',
    modelFormat: 'HH:mm:ss',
    stepping: 15,
    renderer() {
        let props = _.omit(this.props, ['renderer']);
        const {Input, Icon} = props;
        props.addonRight = <Icon icon="icon-calendar"/>;

        return <Input {...props}/>;
    }
};

export default Webiny.createComponent(Time, {
    modules: ['Icon', 'Input', () => import('Webiny/Vendors/DateTimePicker')]
});
