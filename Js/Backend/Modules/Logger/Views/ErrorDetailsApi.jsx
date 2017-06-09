import Webiny from 'Webiny';

class ErrorDetailsApi extends Webiny.Ui.View {

}

ErrorDetailsApi.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/webiny/logger-entry',
            url: this.props.errorEntry.id,
            fields: 'id,stack,clientData',
            prepareLoadedData: data => data.entity
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
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        )}
                    </Ui.Data>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default ErrorDetailsApi;