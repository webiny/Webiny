import Webiny from 'Webiny';

class Body extends Webiny.Ui.Component {

}

Body.defaultProps = {
	renderer() {
		const classes = this.classSet('tile-content', this.props.className);
		return <div {...this.props} className={classes}>{this.props.children}</div>;
	}
};

export default Body;