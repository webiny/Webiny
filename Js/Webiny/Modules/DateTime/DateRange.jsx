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
            alwaysShowCalendars: true,
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

        this.bindMethods('prepare,onChange,setInitialRange');
    }

    componentDidMount() {
        super.componentDidMount();
        this.prepare();
    }

    componentWillUnmount(props) {
        super.componentWillUnmount(props);
        this.unregisterListeners();
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!props.value) {
            this.refs.daterange.value = this.props.placeholder || '';
        } else {
            const dates = props.value.split(this.props.rangeDelimiter);
            this.element.data('daterangepicker').setStartDate(dates[0]);
            this.element.data('daterangepicker').setEndDate(dates[1]);
        }
    }

    setInitialRange(start, end) {
        const from = moment(start, this.options.locale.format, true);
        const to = moment(end, this.options.locale.format, true);
        if (from.isValid() && to.isValid()) {
            this.options.startDate = start;
            this.options.endDate = end;
        }
    }

    prepare() {
        this.element = $(this.refs.daterange);

        const range = _.get(this.options.ranges, _.get(this.props, 'rangeType'));
        _.assign(this.options, this.props.options || {}, _.pick(this.props, this.availableOptions));
        this.options.locale.format = this.props.inputFormat;

        const value = this.getValue();
        if (value) {
            const parts = value.split(this.props.rangeDelimiter);
            this.setInitialRange(parts[0], parts[1]);
        } else if (range) {
            this.setInitialRange(range[0], range[1]);
        }

        this.element.daterangepicker(this.options);
        this.element.on('apply.daterangepicker', (ev, picker) => {
            this.onChange(picker);
        });

        if (!value) {
            this.refs.daterange.value = this.props.placeholder || '';
        }

        return this;
    }

    onChange(picker = {}) {
        try {
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
                this.props.onChange(state.date.range, this.validate);
            }
        } catch (e) {
            console.log(e);
        }
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
    rangeType: 'Last 30 Days', // initial date range
    showValidationMessage: true,
    showValidationAnimation: {translateY: 50, opacity: 1, duration: 225},
    hideValidationAnimation: {translateY: 0, opacity: 0, duration: 225},
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        let validationMessage = false;
        if (this.state.isValid === false) {
            validationMessage = <span className="help-block w-anim">{this.state.validationMessage}</span>;
        }

        const css = this.classSet('form-control', {placeholder: !this.props.value});

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <div className="picker-holder">
                    <input type="text" ref="daterange" className={css} data-toggle="dropdown"/>
                    <span className="icon-calendar icon_c"></span>
                </div>
                <Webiny.Ui.Components.Animate
                    trigger={validationMessage}
                    show={this.props.showValidationAnimation}
                    hide={this.props.hideValidationAnimation}>
                    {this.props.showValidationMessage ? validationMessage : null}
                </Webiny.Ui.Components.Animate>
            </div>
        );
    }
};

export default DateRange;