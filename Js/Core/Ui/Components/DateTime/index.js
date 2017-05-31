import Webiny from 'Webiny';
import moment from 'moment';

class DateTime extends Webiny.Ui.FormComponent {

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
            viewMode: this.props.viewMode,
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
        if (!_.isEmpty(newValue)) {
            newValue = moment(newValue, this.props.modelFormat);
            newValue = newValue.isValid() ? newValue.format(this.props.inputFormat) : '';
        } else {
            newValue = this.getPlaceholder();
        }

        this.getInput().then(() => {
            this.input.val(newValue);

            if (this.props.minDate) {
                this.input.data('DateTimePicker').minDate(new Date(this.props.minDate));
            }
        });
    }

    onChange(newValue) {
        if (newValue) {
            newValue = moment(newValue, this.props.inputFormat).format(this.props.modelFormat);
        }

        if (newValue !== this.props.value) {
            this.props.onChange(newValue, this.validate);
        }
    }
}

DateTime.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    debug: false,
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DDTHH:mm:ssZ',
    positionHorizontal: 'auto',
    positionVertical: 'bottom',
    viewMode: 'days',
    renderer() {
        const props = _.omit(this.props, ['renderer']);
        const {Input, Icon} = props;
        props.addonRight = <Icon icon="icon-calendar"/>;

        return <Input {...props}/>;
    }
});

export default Webiny.createComponent(DateTime, {
    modules: ['Icon', 'Input', 'Webiny/Core/Vendors/DateTimePicker']
});
