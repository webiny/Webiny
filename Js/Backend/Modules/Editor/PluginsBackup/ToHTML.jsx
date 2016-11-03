import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import DraftUtils from './../DraftUtils';

class ToHTMLAction extends Webiny.Ui.Component {

    toHTML(){
        const {editorState, plugins} = this.props;
        console.log(DraftUtils.toHtmlOld(editorState.getCurrentContent()));
        console.log(DraftUtils.toHtml(editorState, plugins));
    }

    render() {
        return (
            <Ui.Button onClick={this.toHTML.bind(this)} icon="fa-code"/>
        );
    }
}

export default {
    name: 'toHtml',
    toolbar: ToHTMLAction
};