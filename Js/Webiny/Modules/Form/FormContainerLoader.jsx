import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

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

        return <Ui.Loader/>;
    }
};

export default FormContainerLoader;