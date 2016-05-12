import Webiny from 'Webiny';

class Tile extends Webiny.Ui.Component {

}

Tile.defaultProps = {
    renderer() {
        const classes = this.classSet('tile', this.props.className);
        return <div className={classes}>{this.props.children}</div>;
    }
};

export default Tile;