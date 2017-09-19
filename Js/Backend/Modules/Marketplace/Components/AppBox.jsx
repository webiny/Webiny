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
                {app.installedVersion ? <p>Installed version: <strong>{app.installedVersion}</strong></p> : null}
                <p>{app.shortDescription}</p>
                <Link route="Marketplace.AppDetails" type="default" params={{id: app.id}}>
                    view details
                </Link>
            </div>
        );
    }
};

export default Webiny.createComponent(AppBox, {styles, modules: ['Link']});