import Webiny from 'Webiny';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        return (
            <div className={this.classSet('modal-footer', this.props.className)}>{this.props.children}</div>
        );
    }
};

export default Footer;