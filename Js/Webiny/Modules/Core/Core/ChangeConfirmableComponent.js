import Webiny from 'Webiny';

class ChangeConfirmableComponent {
    static extend(context) {
        /**
         * Request change and process confirmation settings
         *
         * @param value New value being set
         * @param onConfirm Callback for confirmation
         * @param onCancel Callback for cancellation (onConfirm is used if this one is not set)
         */
        context.requestChange = (value, onConfirm, onCancel = null) => {
            if (!onCancel) {
                onCancel = onConfirm;
            }

            const msg = context.props.confirmation && context.props.confirmation.message(value, context.props.valueLink.value);
            if (!msg) {
                onConfirm(value);
                return;
            }

            let dialogElement = document.querySelector('dialog-holder');
            if (!dialogElement) {
                const dialogHolder = document.createElement('dialog-holder');
                document.body.appendChild(dialogHolder);
                dialogElement = document.querySelector('dialog-holder');
            }

            const props = {
                ui: 'changeConfirmableConfirmationModal',
                message: msg,
                onCancel: () => {
                    value = context.props.confirmation.onCancel(context);
                    onCancel(value || null);
                    ReactDOM.unmountComponentAtNode(dialogElement);
                },
                onConfirm: () => {
                    onConfirm(value);
                    setTimeout(() => {
                        ReactDOM.unmountComponentAtNode(dialogElement);
                    }, 50);
                }
            };
            ReactDOM.render(<Webiny.Ui.Components.Modal.Confirmation {...props}/>, dialogElement);
            context.ui('changeConfirmableConfirmationModal').show();
        };
    }
}

export default ChangeConfirmableComponent;