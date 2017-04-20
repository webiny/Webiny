import Webiny from 'Webiny';

class Panel extends Webiny.Ui.Component {

}

Panel.defaultProps = {
    renderer() {
        const classes = this.classSet('panel', this.props.className);
        return <div className={classes}>{this.props.children}</div>;
    }
};

export default Panel;