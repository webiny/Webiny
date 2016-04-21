import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
    renderer() {
        return (
            <div className="modal-body">
                {this.props.children}
            </div>
        );
    }
};

export default Body;