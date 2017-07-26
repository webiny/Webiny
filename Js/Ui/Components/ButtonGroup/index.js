import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';

class ButtonGroup extends Webiny.Ui.Component {

}

ButtonGroup.defaultProps = {
    renderer() {
        const {styles} = this.props;
        return (
          <div className={styles.btnGroup}>
              {this.props.children}
          </div>
        );
    }
};

export default Webiny.createComponent(ButtonGroup, {styles});
