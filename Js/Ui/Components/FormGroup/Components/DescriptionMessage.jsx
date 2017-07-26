import React from 'react';
import Webiny from 'webiny';
import styles from './../styles.css';

class DescriptionMessage extends Webiny.Ui.Component {

}

DescriptionMessage.defaultProps = {
    renderer() {
        return <span className={styles.descriptionMessage}>{this.props.children}</span>;
    }
};

export default DescriptionMessage;