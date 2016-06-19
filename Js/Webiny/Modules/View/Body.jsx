import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
    noPadding: false,
    renderer() {
        return (
            <Ui.Panel.Body className={{'no-padding': this.props.noPadding}}>
                {this.props.children}
            </Ui.Panel.Body>
        );
    }
};

export default Body;