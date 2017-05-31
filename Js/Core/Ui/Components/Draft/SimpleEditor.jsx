import Webiny from 'Webiny';
import Editor from './Editor';

class SimpleEditor extends Webiny.Ui.Component {
    constructor(props){
        super(props);

        const {Draft} = props;

        let plugins = [
            new Draft.Plugins.Heading(),
            new Draft.Plugins.Bold(),
            new Draft.Plugins.Italic(),
            new Draft.Plugins.Underline(),
            new Draft.Plugins.UnorderedList(),
            new Draft.Plugins.OrderedList(),
            new Draft.Plugins.Alignment(),
            new Draft.Plugins.Link({validate: 'required'}),
            new Draft.Plugins.Blockquote(),
            new Draft.Plugins.Table(),
            new Draft.Plugins.Image()
        ];

        this.plugins = plugins.concat(props.plugins);
    }
}

SimpleEditor.defaultProps = _.merge({}, Editor.defaultProps, {
    renderer() {
        const props = _.omit(this.props, ['plugins', 'renderer']);

        return <Editor plugins={this.plugins} {...props}/>;
    }
});

export default Webiny.createComponent(SimpleEditor, {modules: ['Draft']});