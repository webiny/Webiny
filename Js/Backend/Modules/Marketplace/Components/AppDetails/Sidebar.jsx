import React from 'react';
import Webiny from 'webiny';
import styles from './../../Views/styles.css';

class Sidebar extends Webiny.Ui.View {

}

Sidebar.defaultProps = {

    renderer() {
        const {styles, Link, Icon, Section, app} = this.props;

        return (
            <div className={styles.sidebar}>
                <Section title="Details"/>

                <ul className={styles.detailsList}>
                    <li>
                        Version:
                        <span>{app.version}</span>
                    </li>

                    {app.localName !== 'Webiny' && (
                        <li>
                            Installations:
                            <span>{app.installations}</span>
                        </li>
                    )}

                    {app.localName !== 'Webiny' && (
                        <li>
                            Required Webiny version:
                            <span>{app.webinyVersion}</span>
                        </li>
                    )}

                    <li>
                        Repository:
                        <span><Link url={app.repository} newTab>Visit GitHub</Link></span>
                    </li>

                    <li>
                        Tags:
                        <div className={styles.tags}>
                            {app.tags.map(tag => <span key={tag}>#{tag}</span>)}
                        </div>
                    </li>
                </ul>

                <div className={styles.reportIssue}>
                    <Link type="default" url={`${app.repository}/issues`} newTab><Icon icon="fa-bug"/>Report an Issue</Link>
                </div>

            </div>
        );
    }
};

export default Webiny.createComponent(Sidebar, {styles, modules: ['Link', 'Icon', 'Section']});