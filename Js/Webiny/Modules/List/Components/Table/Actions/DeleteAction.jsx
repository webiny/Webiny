import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class DeleteAction extends Webiny.Ui.Component {

}

DeleteAction.defaultProps = {
    label: 'Delete',
    title: 'Delete confirmation',
    message: 'Are you sure you want to delete this record?',
    hide: _.noop,
    renderer() {
        const message = this.props.message;

        return (
            <Ui.List.Table.ModalAction {..._.pick(this.props, 'data', 'actions', 'label', 'hide')}>
                {function render(record, actions, modal) {
                    const props = {
                        title: this.props.title,
                        confirm: 'Yes, delete!',
                        message,
                        onConfirm: actions.delete(record.id).then(modal.hide())
                    };
                    return (
                        <Ui.Modal.Confirmation {...props}/>
                    );
                }}
            </Ui.List.Table.ModalAction>
        );
    }
};

export default DeleteAction;