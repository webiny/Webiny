import Webiny from 'Webiny';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        return (
            <tfoot>
            <tr></tr>
            </tfoot>
        );
    }
};

export default Footer;