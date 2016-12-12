import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class DeleteAction extends Webiny.Ui.Component {

}

DeleteAction.defaultProps = {
    label: 'Delete',
    title: 'Delete confirmation',
    icon: 'icon-cancel',
    message: 'Are you sure you want to delete this record?',
    confirmButtonLabel: 'Yes, delete!',
    cancelButtonLabel: 'No',
    hide: _.noop,
    afterDelete: _.noop,
    onConfirm(record, actions) {
        return actions.delete(record.id, false).then(res => {
            return Promise.resolve(this.props.afterDelete(res)).then(() => res);
        });
    },
    renderer() {
        const message = this.props.message;
        const $this = this;

        return (
            <Ui.List.Table.ModalAction {..._.pick(this.props, 'data', 'actions', 'label', 'hide', 'afterDelete', 'icon')}>
                {function render(record, actions) {
                    const props = {
                        title: this.props.title,
                        confirm: $this.props.confirmButtonLabel,
                        cancel: $this.props.cancelButtonLabel,
                        message,
                        onComplete: () => {
                            actions.reload();
                        },
                        onConfirm: () => {
                            $this.props.onConfirm.call($this, record, actions);
                        }
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