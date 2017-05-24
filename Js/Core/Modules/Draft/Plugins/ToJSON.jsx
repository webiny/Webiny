import Webiny from 'Webiny';
import BasePlugin from './../BasePlugins/BasePlugin';
import Utils from './../Utils';
const Ui = Webiny.Ui.Components;

const Action = (props) => {
    const click = () => console.log(Utils.editorStateToJSON(props.plugin.editor.getEditorState()));
    return (
        <Ui.Button onClick={click} label="JSON" tooltip="Log editor content"/>
    );
};

class ToJSONPlugin extends BasePlugin {
    constructor(config) {
        super(config);
        this.name = 'toJson';
    }

    getEditConfig() {
        return {
            toolbar: <Action plugin={this}/>
        };
    }
}

export default ToJSONPlugin;