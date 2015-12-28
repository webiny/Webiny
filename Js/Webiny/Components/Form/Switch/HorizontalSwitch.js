import InputComponent from './../Base/InputComponent';
import SwitchButton from './SwitchButton';

class HorizontalSwitch extends InputComponent {

	render() {
        return (
			<div className={this.getComponentWrapperClass()}>
				<div className="form-group">
					<label className="control-label col-xs-4">{this.props.label}</label>

					<div className="col-xs-8 pt5">
						<SwitchButton valueLink={this.props.valueLink} disabled={this.props.disabled}/>
					</div>
				</div>
			</div>
		);
	}
}

export default HorizontalSwitch;
