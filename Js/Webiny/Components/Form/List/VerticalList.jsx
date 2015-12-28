import Base from './Base';

class VerticalList extends Base {

    render() {

        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

		let props = {
			onBlur: this.props.validate ? this.validate : null,
			onKeyDown: this.onKeyDown.bind(this),
			disabled: this.props.disabled,
			className: 'form-control',
			placeholder: this.props.placeholder,
			ref: 'input'
		};

        let input = <input {...props}/>;

        return (
            <div className={this.getComponentWrapperClass()}>
                <div className="form-group">
                    {label}
                    {input}
                    {this.getList()}
                </div>
            </div>
        );
    }
}

export default VerticalList;