import Component from './../../Core/Core/Component';

class Footer extends Component {
    render() {
        var classes = this.classSet('modal-footer panel-footer', this.props.className);
        return <div className={classes}>{this.props.children}</div>;
    }
}


export default Footer;