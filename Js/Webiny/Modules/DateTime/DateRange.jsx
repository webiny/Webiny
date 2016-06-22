import Webiny from 'Webiny';

class DateRange extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        _.assign(this.state, {
            date: {
                start: null,
                end: null
            },
            rangeType: _.get(this.props, 'rangeType', '')
        });

        this.options = {
            autoApply: true,
            locale: {
                format: 'DD/MMM/YY'
            },
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        };

        this.availableOptions = [
            'startDate',
            'endDate',
            'minDate',
            'maxDate',
            'dateLimit',
            'showDropdowns',
            'showWeekNumbers',
            'timePicker',
            'timePickerIncrement',
            'timePicker24hour',
            'timePickerSeconds',
            'ranges',
            'opens',
            'drops',
            'buttonClasses',
            'applyClasses',
            'cancelClasses',
            'locale',
            'singleDatePicker',
            'autoApply',
            'linkedCalendars',
            'parentEl',
            'isInvalidDate',
            'autoUpdateInput',
            'alwaysShowCalendars'
        ];

        this.bindMethods('prepare,setComponentValue,registerListeners');
    }

    componentDidMount() {
        super.componentDidMount();
        this.prepare().registerListeners();
    }

    componentWillUnmount(props) {
        super.componentWillUnmount(props);
        this.unregisterListeners();
    }

    prepare() {
        this.element = $(this.refs.daterange);

        _.assign(this.options, this.props.options || {}, _.pick(this.props, this.availableOptions));
        this.options.locale.format = this.props.inputFormat;

        const range = _.get(this.options.ranges, _.get(this.props, 'rangeType'));
        if (range) {
            const from = moment(range[0], this.options.locale.format, true);
            const to = moment(range[1], this.options.locale.format, true);
            if (from.isValid() && to.isValid()) {
                this.options.startDate = range[0];
                this.options.endDate = range[1];
            }
        }

        this.element.daterangepicker(this.options);
        this.setComponentValue();

        return this;
    }

    setComponentValue(picker = {}) {
        if (!this.refs.daterange) {
            return this;
        }

        const dates = this.refs.daterange.value.split(' - ');
        const from = moment(dates[0], this.props.inputFormat, true);
        const to = moment(dates[1], this.props.inputFormat, true);

        if (from.isValid() && to.isValid()) {
            const fromYmd = from.format(this.props.modelFormat);
            const toYmd = to.format(this.props.modelFormat);
            const state = {
                date: {
                    range: fromYmd + this.props.rangeDelimiter + toYmd,
                    from: fromYmd,
                    to: toYmd
                },
                rangeType: _.get(picker, 'chosenLabel', this.state.rangeType)
            };
            this.setState(state);
            if (this.props.valueLink) {
                this.props.valueLink.requestChange(state.date.range);
            } else {
                this.props.onChange(state.date.range);
            }
        }
    }

    registerListeners() {
        this.element.on('apply.daterangepicker', (ev, picker) => {
            this.setComponentValue(picker);
        });

        return this;
    }

    unregisterListeners() {
        this.element.off('apply.daterangepicker');
        return this;
    }
}

DateRange.defaultProps = {
    onChange: _.noop,
    inputFormat: 'YYYY-MM-DD',
    modelFormat: 'YYYY-MM-DD',
    rangeDelimiter: ':',
    renderer() {
        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        return (
            <div className="form-group">
                {label}
                <div className="picker-holder">
                    <input type="text" ref="daterange" className="form-control pavel" data-toggle="dropdown"/>
                    <span className="icon-calendar icon_c"></span>
                </div>
            </div>
        );
    }
};

export default DateRange;