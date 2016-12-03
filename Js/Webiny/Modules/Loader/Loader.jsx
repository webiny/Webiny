import Webiny from 'Webiny';

class Loader extends Webiny.Ui.Component {

}

Loader.defaultProps = {
    className: null,
    style: null,
    renderer() {
        return (
            <div className={this.classSet('loading-overlay', this.props.className)} style={this.props.style}>
                <div className="loading-overlay__icon-wrapper">
                    <div className="loading-overlay__icon"></div>
                </div>
            </div>
        );
    }
};

export default Loader;