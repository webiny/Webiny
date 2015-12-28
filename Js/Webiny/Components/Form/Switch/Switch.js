import InputComponent from './../Base/InputComponent';
import VerticalSwitch from './VerticalSwitch';
import HorizontalSwitch from './HorizontalSwitch';
import SwitchButton from './SwitchButton';

class Switch extends InputComponent {

	render() {
		var formType = this.props.form ? this.props.form.getFormType() : 'blank';

		if (formType == 'vertical') {
			return React.createElement(VerticalSwitch, this.props);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalSwitch, this.props);
		}

		// Simple switch button
		return React.createElement(SwitchButton, this.props);
	}
}

Switch.defaultProps = {
	disabled: false
};

export default Switch;
