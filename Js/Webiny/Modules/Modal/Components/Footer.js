import Webiny from 'Webiny';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        return (
            <div className="modal-footer">{this.props.children}</div>
        );
    }
};

export default Footer;