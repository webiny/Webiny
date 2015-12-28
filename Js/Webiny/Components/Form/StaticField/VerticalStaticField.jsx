import InputComponent from './../Base/InputComponent';

class VerticalStaticField extends InputComponent {

    render() {

        var css = this.classSet('form-group');
        var label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }
        return (
            <div className={this.getComponentWrapperClass()}>
                <div className={css}>
                    {label}
                    <p className="form-control-static text-muted">{this.props.children}</p>
                </div>
            </div>
        );
    }
}

export default VerticalStaticField;