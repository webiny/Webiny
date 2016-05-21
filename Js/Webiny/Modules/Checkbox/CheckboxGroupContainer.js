import Webiny from 'Webiny';
import CheckboxGroup from './CheckboxGroup';

class CheckboxGroupContainer extends Webiny.Ui.OptionComponent {

    render() {
        let children = this.props.children;
        if (this.state.options.length) {
            children = null;
        }

        return (
            <CheckboxGroup {...this.props} options={this.state.options.length ? this.state.options : null}>{children}</CheckboxGroup>
        );
    }
}

export default CheckboxGroupContainer;