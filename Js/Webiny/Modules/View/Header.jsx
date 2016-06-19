import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    title: null,
    renderer() {
        return (
            <div className="master-content__header master-content__header--with-bg">
                <h2>{this.props.title}</h2>
                {this.props.children}
            </div>
        );
    }
};

export default Header;