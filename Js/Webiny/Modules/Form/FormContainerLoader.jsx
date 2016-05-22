import Webiny from 'Webiny';

class FormContainerLoader extends Webiny.Ui.Component {

}

FormContainerLoader.defaultProps = {
    renderer() {
        if (!this.props.container.isLoading()) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children();
        }

        return null; // TODO: Return loader markup here when it's done
    }
};

export default FormContainerLoader;