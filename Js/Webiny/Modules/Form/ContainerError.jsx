import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const t = Webiny.i18n;

class ContainerError extends Webiny.Ui.Component {

}

ContainerError.defaultProps = {
    renderer() {
        const error = this.props.container.getError();
        return (
            <Ui.Grid.Col all={12}>
                <Ui.Alert title="Save failed" type="error">{container.getError() && container.getError().getMessage()}
                </Ui.Alert>
            </Ui.Grid.Col>
        );
    }
};

export default ContainerError;