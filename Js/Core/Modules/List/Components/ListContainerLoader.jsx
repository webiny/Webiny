import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ListContainerLoader extends Webiny.Ui.Component {

}

ListContainerLoader.defaultProps = {
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

export default ListContainerLoader;