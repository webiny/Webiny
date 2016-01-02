import Component from './../../Core/Core/Component';

class Footer extends Component {

    render() {
        return  <div className="panel-footer clearfix" style={this.props.style}>{this.props.children}</div>;
    }
}

Footer.defaultProps = {
	style: {}
};

export default Footer;