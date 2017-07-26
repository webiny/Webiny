import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';

class Loader extends Webiny.Ui.Component {

}

Loader.defaultProps = {
    className: null,
    style: null,
    renderer() {
        const {styles} = this.props;
        return (
            <div className={this.classSet(styles.overlay, this.props.className)} style={this.props.style}>
                <div className={styles.iconWrapper}>
                    <div className={styles.icon}/>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Loader, {styles});