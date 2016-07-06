import Webiny from 'Webiny';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        let children = this.props.children;
        if (_.isFunction(children)) {
            children = children.call(this, this.props.dialog);
        }
        return (
            <div className={this.classSet('modal-footer', this.props.className)}>{children}</div>
        );
    }
};

export default Footer;