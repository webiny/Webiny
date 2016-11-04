import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const t = Webiny.i18n;

class Toolbar extends Webiny.Ui.Component {

}

Toolbar.defaultProps = {
    renderer() {
        return (
            <div className="editor-toolbar">
                {this.props.plugins.getToolbarActions().map((action, i) => {
                    return (
                        <span key={i} className="toolbar-action">{action}</span>
                    );
                })}
            </div>
        );
    }
};

export default Toolbar;