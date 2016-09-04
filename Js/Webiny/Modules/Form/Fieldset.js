import Webiny from 'Webiny';

class Fieldset extends Webiny.Ui.Component {

}

Fieldset.defaultProps = {
    icon: null,
    renderer() {
        let icon = null;
        if (this.props.icon) {
            icon = <Webiny.Ui.Components.Icon icon={this.props.icon}/>;
        }

        return (
            <div className="options-section">
                <div className="options-header">
                    <h5 className="options-title">{icon}{this.props.title}</h5>

                    <div className="form-group form-group--inline-label search-container">{this.props.children}</div>
                </div>
            </div>
        );
    }
};

export default Fieldset;
