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
            <Rad.Components.Router.Link onClick={this.onClick.bind(this)}
                                        className="btn btn-blue ml2 mr2 btn-sm" {...this.props}>
				{this.props.label || 'Edit'}
            </Rad.Components.Router.Link>
        );
    }
}

export default Edit;