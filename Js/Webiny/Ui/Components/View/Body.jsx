import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
    noPadding: false,
    renderer() {
        const {Panel} = this.props;
        return (
            <Panel.Body className={{'panel-body--no-padding': this.props.noPadding}}>
                {this.props.children}
            </Panel.Body>
        );
    }
};

export default Webiny.createComponent(Body, {modules: ['Panel']});