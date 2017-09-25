import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';

class AppBox extends Webiny.Ui.View {
}

AppBox.defaultProps = {
    renderer() {
        const {styles, Link, app} = this.props;

        return (
            <div className={styles.appBox}>
                <div className={styles.logo}>
                    <img src={app.logo.src}/>
                </div>
                <h3>{app.name.toUpperCase()}</h3>

                <p className={styles.shortDescription}>{app.shortDescription}</p>
                <Link route="Marketplace.AppDetails" type="default" params={{id: app.id}} className={styles.viewDetails}>
                    view details
                </Link>
                {app.installedVersion && (<div className={styles.footer}>
                    <p>Installed version: <strong>{app.installedVersion}</strong></p>
                </div>)}
            </div>
        );
    }
};

export default Webiny.createComponent(AppBox, {styles, modules: ['Link']});