import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;
import ApiTokenModalForm from './Modal/ApiTokenForm';

class ApiTokensList extends Webiny.Ui.View {

}

ApiTokensList.defaultProps = {
    renderer() {
        const listProps = {
            api: '/entities/core/api-tokens',
            fields: '*,createdOn',
            searchFields: 'owner,token',
            connectToRouter: true,
            perPage: 100
        };

        return (
            <Ui.ViewSwitcher.Container>
                <Ui.ViewSwitcher.View view="tokensListView" defaultView>
                    {showView => (
                        <Ui.View.List>
                            <Ui.View.Header
                                title="API Tokens"
                                description="If you want to grant access to your API to users outside of your domain, create an API token">
                                <Ui.Button
                                    type="primary"
                                    align="right"
                                    onClick={showView('tokenModalView')}
                                    icon="icon-plus-circled"
                                    label="Create new token"/>
                            </Ui.View.Header>
                            <Ui.View.Body>
                                <Ui.List.ApiContainer {...listProps}>
                                    <Ui.List.FormFilters>
                                        {(applyFilters) => (
                                            <Ui.Input
                                                placeholder="Search by owner or token"
                                                name="_searchQuery"
                                                onEnter={applyFilters()}/>
                                        )}
                                    </Ui.List.FormFilters>
                                    <Table.Table>
                                        <Table.Row>
                                            <Table.Field name="token" align="left" label="Token"/>
                                            <Table.Field name="owner" align="left" label="Owner" sort="owner"/>
                                            <Table.TimeAgoField
                                                name="lastActivity"
                                                align="center"
                                                label="Last activity"
                                                sort="lastActivity"/>
                                            <Table.TimeAgoField
                                                name="createdOn"
                                                align="center"
                                                label="Created On"
                                                sort="createdOn"/>
                                            <Table.ToggleField
                                                name="enabled"
                                                label="Enabled"
                                                sort="enabled"
                                                align="center"
                                                message={checked => {
                                                    if (!checked) {
                                                        return (
                                                            <span>This will disable API token and prevent it's bearer from using your API!
                                                                <br/>Are you sure you want to disable it?
                                                            </span>
                                                        );
                                                    }
                                                }}/>
                                            <Table.Actions>
                                                <Table.EditAction label="Edit" onClick={showView('tokenModalView')}/>
                                                <Table.DeleteAction/>
                                            </Table.Actions>
                                        </Table.Row>
                                        <Table.Footer/>
                                    </Table.Table>
                                    <Ui.List.Pagination/>
                                </Ui.List.ApiContainer>
                            </Ui.View.Body>
                        </Ui.View.List>
                    )}
                </Ui.ViewSwitcher.View>

                <Ui.ViewSwitcher.View view="tokenModalView" modal>
                    {(showView, data) => <ApiTokenModalForm {...{showView, data}} />}
                </Ui.ViewSwitcher.View>
            </Ui.ViewSwitcher.Container>
        );
    }
};

export default ApiTokensList;