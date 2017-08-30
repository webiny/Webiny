import React from 'react';
import Webiny from 'webiny';
import styles from './../../Views/styles.css';

class Sidebar extends Webiny.Ui.View {

}

Sidebar.defaultProps = {

    renderer() {

        const {styles, Link, Icon, Section} = this.props;

        return (
            <div className={styles.sidebar}>
                <Section title="Details"/>

                <ul className={styles.detailsList}>
                    <li>
                        Version:
                        <span>1.0.1</span>
                    </li>

                    <li>
                        Installations:
                        <span>1.023</span>
                    </li>

                    <li>
                        Required Webiny version:
                        <span>1.0.0</span>
                    </li>

                    <li>
                        Repository:
                        <span><Link url="https://github.com/Webiny/NotificationManager" newTab={true}>Visit GitHub</Link></span>
                    </li>

                    <li>
                        Tags:
                        <div className={styles.tags}>
                            <span>#php</span>
                            <span>#cron</span>
                            <span>#tag-3</span>
                            <span>#tag-4</span>
                            <span>#php</span>
                            <span>#cron</span>
                            <span>#tag-3</span>
                            <span>#tag-4</span>
                        </div>
                    </li>
                </ul>

                <div className={styles.reportIssue}>
                    <Link type="default" url="https://github.com/Webiny/NotificationManager/issues" newTab={true}><Icon icon="fa-bug"/>Report an Issue</Link>
                </div>

            </div>
        );
    }
};

export default Webiny.createComponent(Sidebar, {styles, modules: ['Link', 'Icon', 'Section']});