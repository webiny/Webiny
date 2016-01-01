import Action from './Action';

class Edit extends Action {

    onClick() {
        var inlineRenderMethod = this.props.context.actionEditInlineContent;
        if (inlineRenderMethod) {
            var key = 'table-tr-' + this.props.data.id + '-inline-content';
            this.props.table.setDynamicContent(key, inlineRenderMethod());
        } else {
            this.emitAction()
        }
    }

    render() {
        return (
            <Webiny.Ui.Components.Router.Link onClick={this.onClick.bind(this)}
                                        className="btn btn-blue ml2 mr2 btn-sm" {...this.props}>
				{this.props.label || 'Edit'}
            </Webiny.Ui.Components.Router.Link>
        );
    }
}

export default Edit;