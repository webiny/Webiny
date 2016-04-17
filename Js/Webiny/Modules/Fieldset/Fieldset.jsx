import Webiny from 'Webiny';

class Fieldset extends Webiny.Ui.Component {
    // This component doesn't do anything beyond rendering itself
}

Fieldset.defaultProps = {
    renderer: function renderer() {
        return (
			<fieldset {...this.props}>
				{this.props.title && (
					<legend>{this.props.title}</legend>
				)}
				{this.props.children}
			</fieldset>
		);
    }
};

export default Fieldset;
