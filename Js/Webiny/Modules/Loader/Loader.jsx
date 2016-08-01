import Webiny from 'Webiny';

class Loader extends Webiny.Ui.Component {

}

Loader.defaultProps = {
    renderer() {
        return (
            <div className="loading-overlay">
                <div className="loading-overlay__icon-wrapper">
                    <div className="loading-overlay__icon"></div>
                </div>
            </div>
        );
    }
};

export default Loader;