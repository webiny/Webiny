import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
    noPadding: false,
    renderer() {
        return (
            <div className={this.classSet('modal-body', {'modal-body--no-padding': this.props.noPadding}, this.props.className)}>
                {this.props.children}
            </div>
        );
    }
};

export default Webiny.createComponent(Body);