import Webiny from 'Webiny';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    style: {},
    renderer: function renderer() {
        const classes = this.classSet('panel-footer', this.props.className);
        return <div className={classes} style={this.props.style}>{this.props.children}</div>;
    }
};

export default Footer;