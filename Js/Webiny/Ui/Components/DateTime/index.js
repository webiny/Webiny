import Webiny from 'Webiny';
import moment from 'moment';

class DateTime extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.valueChanged = false;

        this.bindMethods('setValue');
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
        // Tricky part: since we are lazy loading dependencies - Input may not yet be available in the DOM so we need to wait for it
        this.interval = setInterval(() => {
            const dom = ReactDOM.findDOMNode(this);
            if (dom) {
                clearInterval(this.interval);
                this.interval = null;
                this.setup();
            }
        }, 100);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.setValue(this.props.value);
    }

    setup() {
        this.input = $(ReactDOM.findDOMNode(this).querySelector('input'));
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

        this.input.val(newValue);

        if (this.props.minDate) {
            this.input.data('DateTimePicker').minDate(new Date(this.props.minDate));
        }
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

DateTime.defaultProps = {
    onChange: _.noop,
    debug: false,
    disabled: false,
    readOnly: false,
    placeholder: null,
    inputFormat: 'YYYY-MM-DD HH:mm:ss',
    modelFormat: 'YYYY-MM-DDTHH:mm:ssZ',
    viewMode: 'days',
    renderer() {
        const props = _.omit(this.props, ['renderer']);
        const {Input, Icon} = props;
        props.addonRight = <Icon icon="icon-calendar"/>;

        return <Input {...props}/>;
    }
};

export default Webiny.createComponent(DateTime, {
    modules: ['Icon', 'Input', () => import('Webiny/Vendors/DateTimePicker')]
});
