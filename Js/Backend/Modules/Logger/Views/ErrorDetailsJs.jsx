import Webiny from 'Webiny';

class ErrorDetailsJs extends Webiny.Ui.View {

}

ErrorDetailsJs.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/core/logger-entry',
            url: this.props.errorEntry.id,
            fields: 'id, stack, clientData'
        };

        return (
            <Webiny.Ui.LazyLoad modules={['Data', 'Grid', 'CodeHighlight']}>
                {(Ui) => (
                    <Ui.Data {...statProps}>
                        {errorData => (
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={12}>
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
                )}
            </Webiny.Ui.LazyLoad>

        );
    }
};

export default ErrorDetailsJs;