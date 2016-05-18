import Webiny from 'Webiny';

class ChangeConfirmableComponent {
    static extend(context) {
        context.requestChange = (value, callback) => {
            const msg = context.props.confirmation && context.props.confirmation.message(value, context.props.valueLink.value);
            if (!msg) {
                context.props.valueLink.requestChange(value, callback);
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
                    context.props.valueLink.requestChange(value || null, callback);
                    ReactDOM.unmountComponentAtNode(dialogElement);
                },
                onConfirm: () => {
                    context.props.valueLink.requestChange(value, callback);
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