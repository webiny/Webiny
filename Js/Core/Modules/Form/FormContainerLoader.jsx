import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FormContainerLoader extends Webiny.Ui.Component {

}

FormContainerLoader.defaultProps = {
    show: false,
    renderer() {
        if (!this.props.show) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children();
        }

        return <Ui.Loader/>;
    }
};

export default FormContainerLoader;