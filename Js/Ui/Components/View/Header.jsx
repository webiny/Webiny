import React from 'react';
import Webiny from 'webiny';
import styles from './styles.css';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    title: null,
    renderer() {
        const {styles} = this.props;

        // extract the app name
        const appName = Webiny.Router.getActiveRoute().module.app.name.split('.')[0];

        return (
            <div className={styles.viewHeader}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.titleContent}>
                        <span className={styles.appName}>{appName}/</span>{this.props.title}
                    </h2>

                    <div className={styles.titleDescription}>{this.props.description}</div>
                </div>
                <div className={styles.titleRight}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(Header, {styles});