import BaseComponent from '/Core/Base/BaseComponent';

class Checkbox extends BaseComponent {

	getTemplate(){ return '<div className="col-sm-offset-2 col-sm-10">\
    <div className="checkbox">\
        <label>\
            <input disabled={this.props.disabled} type="checkbox" ref={this.state.ref} onChange={this.onChange} checked={this.dynamic.checked}/> {this.props.label}\
        </label>\
    </div>\
</div>';
	}

	getFqn() {
		return 'Core.View.Checkbox';
	}

	getInitialState() {
		return {
			ref: Tools.createUID()
		};
	}

	getDefaultProperties() {
		return {
			disabled: false,
			label: ''
		}
	}

	getDynamicProperties() {
		return {
			checked: this.props.valueLink.value
		}
	}

	onChange() {
		var el = this.getNode(this.state.ref);
		var checked = $(el).is(':checked');
		this.props.valueLink.requestChange(checked, this.props['bind-change'] || null);
	}
}

export default Checkbox;
