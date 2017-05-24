import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    align: null,
    renderer() {
        const css = this.classSet(
            'panel-footer--white-bg',
            this.props.align === 'right' ? 'text-right' : null,
            this.props.className
        );

        return (
            <Ui.Panel.Footer className={css}>
                {this.props.children}
            </Ui.Panel.Footer>
        );
    }
};

export default Footer;