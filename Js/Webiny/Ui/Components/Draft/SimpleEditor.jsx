import Webiny from 'Webiny';
import Editor from './Editor';

class SimpleEditor extends Webiny.Ui.Component {

}

SimpleEditor.defaultProps = _.merge({}, Editor.defaultProps, {
    renderer() {
        let plugins = [
            new Webiny.Draft.Plugins.Heading(),
            new Webiny.Draft.Plugins.Bold(),
            new Webiny.Draft.Plugins.Italic(),
            new Webiny.Draft.Plugins.Underline(),
            new Webiny.Draft.Plugins.UnorderedList(),
            new Webiny.Draft.Plugins.OrderedList(),
            new Webiny.Draft.Plugins.Alignment(),
            new Webiny.Draft.Plugins.Link({validate: 'required'}),
            new Webiny.Draft.Plugins.Blockquote(),
            new Webiny.Draft.Plugins.Table(),
            new Webiny.Draft.Plugins.Image()
        ];

        plugins = _.merge(plugins, this.props.plugins);

        const props = _.omit(this.props, ['plugins', 'renderer']);

        return (<Webiny.Ui.Components.Draft.Editor plugins={plugins} {...props}/>);
    }
});

export default SimpleEditor;