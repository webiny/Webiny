import Base from './Base';

class HorizontalList extends Base {

    render() {

		let props = {
			onBlur: this.props.validate ? this.validate : null,
			onKeyDown: this.onKeyDown.bind(this),
			disabled: this.props.disabled,
			autoComplete: 'off',
			className: 'form-control',
			placeholder: this.props.placeholder,
			ref: 'input'
		};

        return (
            <div className={this.getComponentWrapperClass()}>
                <div className="form-group">
                    <label className="control-label col-xs-4">{this.props.label}</label>

                    <div className="col-xs-8">
                        <input {...props}/>
                        {this.getList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default HorizontalList;