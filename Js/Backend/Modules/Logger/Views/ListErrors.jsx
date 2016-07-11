import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class ListErrors extends Webiny.Ui.View {

}

ListErrors.defaultProps = {

    renderer() {
        const jsErrorList = {
            api: '/entities/logger/logger-error-group',
            fields: '*',
            connectToRouter: true,
            searchFields: 'error',
            defaultQuery: {type: 'js'}
        };

        const apiErrorList = {
            api: '/entities/logger/logger-error-group',
            fields: '*',
            connectToRouter: true,
            searchFields: 'error',
            defaultQuery: {type: 'api'}
        };

        return (

            <Ui.View.List>
                <Ui.View.Header title="Logger"/>

                <Ui.View.Body noPadding={true}>

                    <Ui.Tabs.Tabs size="large">
                        <Ui.Tabs.Tab label="JavaScript">

                            <Ui.List.ApiContainer ui="jsErrorList" {...jsErrorList}>
                                <Table.Table>
                                    <Table.Row>
                                        <Table.Field name="name" align="left" label="Name" sort="name"/>
                                        <Table.Field name="url" align="left" label="Url" sort="url"/>
                                    </Table.Row>
                                    <Table.Empty/>
                                </Table.Table>
                                <Ui.List.Pagination/>
                            </Ui.List.ApiContainer>
                        </Ui.Tabs.Tab>
                    </Ui.Tabs.Tabs>


                </Ui.View.Body>
            </Ui.View.List>

        );
    }
};

export default ListErrors;