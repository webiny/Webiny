import Webiny from 'Webiny';

class Row extends Webiny.Ui.Component {
    // This component doesn't do much :)
}


Row.defaultProps = {
    renderer() {
        return <div {...this.props} className={this.classSet('row', this.props.className)}>{this.props.children}</div>;
    }
};

export default Row;