import InputComponent from './../Base/InputComponent';
import SwitchButton from './SwitchButton';

class VerticalSwitch extends InputComponent {

	render() {
		return (
			<div className={this.getComponentWrapperClass()}>
				<div className="form-group">
					<label className="control-label">{this.props.label}</label>
					<div className="clearfix"></div>
					<SwitchButton valueLink={this.props.valueLink} disabled={this.props.disabled}/>
				</div>
			</div>
		);
	}

}

export default VerticalSwitch;
