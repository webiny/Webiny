import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';
import appImage from 'Assets/mp-images/app-image.png';


class AppBox extends Webiny.Ui.View {
    constructor(props) {
        super(props);

    }

}

AppBox.defaultProps = {

    renderer() {

        const {styles, Link} = this.props;

        return (
            <div className={styles.appBox}>
                <div className={styles.logo}>
                    <img src={appImage}/>
                </div>
                <h3>NOTIFICATION MANAGER</h3>
                <p>
                    Manage permissions, create users and assign roles. Create API tokens and monitor requests and
                    responses for each of them individually.
                </p>
                <Link route="Marketplace.AppDetails" type="default">
                    view details
                </Link>
            </div>
        );
    }
};

export default Webiny.createComponent(AppBox, {styles, modules: ['Link']});