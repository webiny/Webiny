import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class DeleteAction extends Webiny.Ui.Component {

}

DeleteAction.defaultProps = {
    label: 'Delete',
    message: 'Are you sure you want to delete this record?',
    hide: _.noop,
    renderer: function renderer() {
        const message = this.props.message;

        return (
            <Ui.List.Table.ModalAction {..._.pick(this.props, 'data', 'actions','label','hide')}>
                {function (record, actions, modal) {
                    return (
                        <Ui.Modal.Dialog>
                            <Ui.Modal.Header title="Delete confirmation"/>
                            <Ui.Modal.Body>
                                <p>{message}</p>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer>
                                <Ui.Button label="No" onClick={modal.hide()}/>
                                <Ui.Button label="Yes, delete!" onClick={actions.delete(record.id).then(modal.hide())}/>
                            </Ui.Modal.Footer>
                        </Ui.Modal.Dialog>
                    );
                }}
            </Ui.List.Table.ModalAction>
        );
    }
};

export default DeleteAction;