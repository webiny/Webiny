import Webiny from 'Webiny';
const Utils = Webiny.Draft.Utils;

const Action = (props) => {
    const click = () => console.log(Utils.editorStateToJSON(props.plugin.editor.getEditorState()));
    return (
        <Webiny.Ui.LazyLoad modules={['Button']}>
            {({Button}) => (
                <Button onClick={click} label="JSON" tooltip="Log editor content"/>
            )}
        </Webiny.Ui.LazyLoad>
    );
};

class ToJSONPlugin extends Webiny.Draft.BasePlugin {
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