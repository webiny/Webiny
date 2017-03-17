import Webiny from 'Webiny';

class Fieldset extends Webiny.Ui.Component {

}

Fieldset.defaultProps = {
    title: null,
    className: null,
    style: null,
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