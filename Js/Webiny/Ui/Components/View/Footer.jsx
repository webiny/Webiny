import Webiny from 'Webiny';

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

        const {Panel} = this.props;

        return (
            <Panel.Footer className={css}>
                {this.props.children}
            </Panel.Footer>
        );
    }
};

export default Webiny.createComponent(Footer, {modules: ['Panel']});