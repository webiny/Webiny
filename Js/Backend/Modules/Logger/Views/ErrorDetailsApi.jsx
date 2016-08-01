import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ErrorDetailsApi extends Webiny.Ui.View {

}

ErrorDetailsApi.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/core/logger-entry',
            url: this.props.errorEntry.id,
            fields: 'id, stack, clientData'
        };

        return (
            <Ui.Data {...statProps}>
                {errorData => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.CodeHighlight language="json">
                                {JSON.stringify(errorData.clientData, null, 2)}
                            </Ui.CodeHighlight>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Ui.Data>
        );
    }
};

export default ErrorDetailsApi;