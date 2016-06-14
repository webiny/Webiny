import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
    renderer() {
        return (
            <div className={this.classSet('modal-body', this.props.className)}>
                {this.props.children}
            </div>
        );
    }
};

export default Body;