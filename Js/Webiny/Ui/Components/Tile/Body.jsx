import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
    style: null,
    renderer() {
        const classes = this.classSet('tile-content', this.props.className);
        return <div style={this.props.style} className={classes}>{this.props.children}</div>;
    }
};

export default Webiny.createComponent(Body);