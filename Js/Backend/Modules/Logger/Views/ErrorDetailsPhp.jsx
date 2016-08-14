import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ErrorDetailsPhp extends Webiny.Ui.View {

}

ErrorDetailsPhp.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/core/logger-entry',
            url: this.props.errorEntry.id,
            fields: 'id, stack'
        };

        return (
            <Ui.Data {...statProps}>
                {errorData => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.CodeHighlight language="php">
                                {errorData.stack}
                            </Ui.CodeHighlight>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Ui.Data>
        );
    }
};

export default ErrorDetailsPhp;