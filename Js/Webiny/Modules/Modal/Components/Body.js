import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {
    render() {
        return (
            <div className="modal-body">
                {this.props.children}
            </div>
        );
    }
}

export default Body;