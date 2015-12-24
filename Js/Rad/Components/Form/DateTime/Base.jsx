import InputComponent from './../Base/InputComponent';

class Base extends InputComponent {

    constructor() {
        super();
        _.assign(this.state, {
            selectedValue: null
        });
        this.valueLink = this.linkState('selectedValue');
    }

	setValue(){
		var newValue = this.props.valueLink.value;

		if (this.props.component != 'time') {
			newValue = moment(newValue, this.props.modelFormat);
			newValue = newValue.isValid() ? newValue.format(this.props.inputFormat) : ''
		}

		this.input.val(newValue);

		if(this.props.minDate){
			this.input.data("DateTimePicker").minDate(new Date(this.props.minDate));
		}
	}

    /**
     * Initialize DateTimePicker
     * @url https://eonasdan.github.io/bootstrap-datetimepicker/
     */
    componentDidMount() {
        this.input = $(ReactDOM.findDOMNode(this)).find('input');
        this.input.datetimepicker({
            format: this.props.inputFormat,
            stepping: 15,
            keepOpen: false,
			minDate: this.props.minDate ? new Date(this.props.minDate) : false,
			viewMode: this.props.viewMode
        }).on("dp.change", e => {
            var newValue = this.input.val();
            if (this.props.component != 'time') {
                newValue = e.date.format(this.props.inputFormat);
            }
            this.valueLink.requestChange(newValue);
        });

		this.setValue();
    }

    componentDidUpdate() {
        this.setValue();
    }

    onChangeSelectedValue(sel) {
        if (this.props.component != 'time') {
            sel = moment(sel, this.props.inputFormat).format(this.props.modelFormat);
        }
        this.props.valueLink.requestChange(sel);
    }

}

export default Base;
