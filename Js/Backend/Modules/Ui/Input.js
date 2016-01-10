import Webiny from 'Webiny';

Webiny.Configure('Webiny.Ui.Input', {
    renderer: function renderer() {
        return (
            <div className="form-group">
                <label className="control-label">{this.props.label}</label>
                <input type="text" className="form-control" placeholder={this.props.placeholder || ''}/>
            </div>
        );
    }
});
