import InputComponent from './../Base/InputComponent';

class HorizontalStaticField extends InputComponent {

    render() {

        var css = this.classSet(['form-group']);

        var label = <label className="control-label col-xs-4">{this.props.label}</label>;
        var wrapperClass = 'col-xs-8';

        return (
            <div className={this.getComponentWrapperClass()}>
                <div className={css}>
                    {label}
                    <div className={wrapperClass}>
                        <div className="bs-component">
                            <p className="form-control-static text-muted">{this.props.children}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HorizontalStaticField;
