import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        return (
            <Ui.Panel.Footer className={this.classSet('panel-footer--white-bg', this.props.className)}>
                {this.props.children}
            </Ui.Panel.Footer>
        );
    }
};

export default Footer;