import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';

class Tile extends Webiny.Ui.Component {

}

Tile.defaultProps = {
    className: null,
    renderer() {
        const {styles} = this.props;
        const classes = this.classSet(styles.tile, this.props.className);

        return <div className={classes}>{this.props.children}</div>;
    }
};

export default Webiny.createComponent(Tile, {styles});
