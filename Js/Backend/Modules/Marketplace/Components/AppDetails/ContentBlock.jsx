import React from 'react';
import Webiny from 'webiny';
import styles from './../../Views/styles.css';
import './../../Views/draft.scss';

class ContentBlock extends Webiny.Ui.View {

}

ContentBlock.defaultProps = {

    renderer() {

        const {styles, Section} = this.props;

        return (
            <content-block>
                <Section title="About the App"/>

                <div className={styles.description}>
                    <h2>Description</h2>
                    <p>Akismet checks your comments and contact form submissions against our global database of spam to prevent
                        your site from publishing malicious content. You can review the comment spam it catches on your blog’s “Comments” admin screen.</p>
                    <p>Major features in Akismet include:</p>

                    <ul>
                        <li>Automatically checks all comments and filters out the ones that look like spam.</li>
                        <li>Each comment has a status history, so you can easily see which comments were caught or cleared by Akismet and which were spammed or unspammed by a moderator.</li>
                        <li>URLs are shown in the comment body to reveal hidden or misleading links.</li>
                        <li>Moderators can see the number of approved comments for each user.</li>
                        <li>A discard feature that outright blocks the worst spam, saving you disk space and speeding up your site.</li>
                    </ul>

                    <p>PS: You’ll need an <a href="https://akismet.com/get/" rel="nofollow">Akismet.com API key</a> to use it.
                        Keys are free for personal blogs; paid subscriptions are available for businesses and commercial sites.</p>
                </div>

            </content-block>
        );
    }
};

export default Webiny.createComponent(ContentBlock, {styles, modules: ['Section']});