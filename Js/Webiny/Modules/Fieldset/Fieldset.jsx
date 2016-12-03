import Webiny from 'Webiny';

class Fieldset extends Webiny.Ui.Component {
    // This component doesn't do anything beyond rendering itself
}

Fieldset.defaultProps = {
    renderer() {
        return (
            <fieldset {..._.pick(this.props, ['className', 'style'])}>
                {this.props.title && (
                    <legend>{this.props.title}</legend>
                )}
                {this.props.children}
            </fieldset>
        );
    }
};

export default Fieldset;
