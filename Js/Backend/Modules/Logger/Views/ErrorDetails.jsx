import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ErrorDetails extends Webiny.Ui.View {

}

ErrorDetails.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/core/logger-entry',
            url: this.props.errorEntry,
            fields: 'id, stack, clientData'
        };

        console.log('render details:' + this.props.errorEntry);

        return (
            <Ui.Data {...statProps}>
                {errorData => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <h4>{this.props.url}</h4>
                            <Ui.CodeHighlight language="json">
                                {JSON.stringify(errorData.clientData, null, 2)}
                            </Ui.CodeHighlight>

                            <Ui.CodeHighlight>
                                {errorData.stack}
                            </Ui.CodeHighlight>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Ui.Data>
        );
    }
};

export default ErrorDetails;