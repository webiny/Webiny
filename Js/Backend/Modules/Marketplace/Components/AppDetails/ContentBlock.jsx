import React from 'react';
import Webiny from 'webiny';
import styles from './../../Views/styles.css';
import './../../Views/draft.scss';

class ContentBlock extends Webiny.Ui.View {
    constructor(props){
        super(props);

        this.plugins = this.getPlugins();
        this.bindMethods('getPlugins');
    }

    getPlugins() {
        const {Draft} = this.props;
        return [
            new Draft.Plugins.Heading(),
            new Draft.Plugins.Bold(),
            new Draft.Plugins.Italic(),
            new Draft.Plugins.Underline(),
            new Draft.Plugins.UnorderedList(),
            new Draft.Plugins.OrderedList(),
            new Draft.Plugins.Alignment(),
            new Draft.Plugins.Link({validate: 'required'}),
            new Draft.Plugins.Blockquote(),
            new Draft.Plugins.Code(),
            new Draft.Plugins.ToJSON()
        ];
    }
}

ContentBlock.defaultProps = {
    title: null,
    renderer() {
        const {Section, Draft, styles, title, content} = this.props;

        return (
            <content-block>
                {title && <Section title={title}/>}
                <div className={styles.description}>
                    <Draft.Editor value={content} preview={true} plugins={this.plugins} toolbar={false}/>
                </div>
            </content-block>
        );
    }
};

export default Webiny.createComponent(ContentBlock, {styles, modules: ['Section', 'Draft']});