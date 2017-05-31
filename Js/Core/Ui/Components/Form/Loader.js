import Webiny from 'Webiny';

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

        const {Loader} = this.props;

        return <Loader/>;
    }
};

export default Webiny.createComponent(FormContainerLoader, {modules: ['Loader']});