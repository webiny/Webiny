import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BasePlugin from './../BasePlugins/BasePlugin';
import Utils from './../Utils';

const Action = (props) => {
    const click = () => console.log(Utils.editorStateToJSON(props.editor.getEditorState()));
    return (
        <Ui.Button onClick={click} label="JSON"/>
    );
};

class ToJSONPlugin extends BasePlugin {
    constructor(config) {
        super(config);
        this.name = 'toJson';
    }

    getEditConfig() {
        return _.merge(super.getEditConfig(), {
            toolbar: <Action/>
        });
    }
}

export default ToJSONPlugin;