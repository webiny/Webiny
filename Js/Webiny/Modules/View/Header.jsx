import Webiny from 'Webiny';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    title: null,
    renderer() {
        return (
            <div className="master-content__header master-content__header--with-bg">
                <div className="master-content__title-wrapper">
                    <h2 className="master-content__title">{this.props.title}</h2>

                    <div className="master-content__description">{this.props.description}</div>
                </div>
                {this.props.children}
            </div>
        );
    }
};

export default Header;