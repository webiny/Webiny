import React from 'react';
import Webiny from 'webiny';
import styles from './../Views/styles.css';

class SubmitAppBox extends Webiny.Ui.View {
}

SubmitAppBox.defaultProps = {
    renderer() {
        const {styles, Link, Icon} = this.props;

        return (
            <div className={this.classSet(styles.appBox, styles.empty)}>
                <div className={styles.logo}>
                    <Icon icon="fa-plus"/>
                </div>
                <h3>Submit an App</h3>
                <p>Interested in contributing an app to Webiny Marketplace? <br/>
                    Great, please use the email below and drop us a note with a link to the GitHub repo and any other relevant detail you want to share with us.</p>
                <Link mailTo="contribute@webiny.com">contribute@webiny.com</Link>
            </div>
        );
    }
};

export default Webiny.createComponent(SubmitAppBox, {styles, modules: ['Link', 'Icon']});