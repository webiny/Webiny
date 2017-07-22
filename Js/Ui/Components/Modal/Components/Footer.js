import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';
import styles from '../styles.css';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        let children = this.props.children;
        if (_.isFunction(children)) {
            children = children.call(this, this.props.dialog);
        }
        return (
            <div className={this.classSet(styles.footer, this.props.className)}>{children}</div>
        );
    }
};

export default Webiny.createComponent(Footer, {styles});