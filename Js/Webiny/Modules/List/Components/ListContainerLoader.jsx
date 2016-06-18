import Webiny from 'Webiny';

class ListContainerLoader extends Webiny.Ui.Component {

}

ListContainerLoader.defaultProps = {
    renderer() {
        if (!this.props.container.isLoading()) {
            return null;
        }

        if (_.isFunction(this.props.children)) {
            return this.props.children();
        }

        return (
            <div className="loading-overlay">
                <div className="loading-overlay__icon-wrapper">
                    <div className="loading-overlay__icon"></div>
                </div>
            </div>
        );
    }
};

export default ListContainerLoader;