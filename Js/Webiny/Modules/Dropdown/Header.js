import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    renderer() {
        const props = _.clone(this.props);
        return <li role="presentation" className="dropdown-header">{props.title}</li>;
    }
};

export default Header;
