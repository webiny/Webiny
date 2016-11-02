import Webiny from 'Webiny';
import DraftUtils from './../DraftUtils';
const Ui = Webiny.Ui.Components;

class ToJSONAction extends Webiny.Ui.Component {

    toJSON(){
        console.log(DraftUtils.editorStateToJSON(this.props.editor.getEditorState()));
    }

    render() {
        return (
            <Ui.Button onClick={this.toJSON.bind(this)} label="JSON"/>
        );
    }
}

export default () => {
    return {
        name: 'toJson',
        toolbar: <ToJSONAction/>
    };
}