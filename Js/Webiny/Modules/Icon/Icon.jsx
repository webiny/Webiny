import Webiny from 'Webiny';

class Icon extends Webiny.Ui.Component {

}

Icon.defaultProps = {
    renderer: function renderer() {
        return (
            <span className={this.classSet('icon icon-' + this.props.icon, this.props.className)}></span>
        );
    }
};

export default Icon;