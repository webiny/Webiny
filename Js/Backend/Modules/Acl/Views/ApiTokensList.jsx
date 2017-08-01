import React from 'react';
import Webiny from 'webiny';
import ApiTokenModal from './Modal/ApiTokenModal';
import SystemApiTokenModal from './Modal/SystemApiToken';

class ApiTokensList extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            apiToken: null
        };
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint('/services/webiny/acl').get('token').then(apiResponse => {
            if (!apiResponse.isError()) {
                this.setState({apiToken: apiResponse.getData('token')});
            }
        });
    }
}

ApiTokensList.defaultProps = {
    renderer() {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'View', 'Button', 'Icon', 'List', 'Input', 'Link']}>
                {(Ui) => {
                    const Table = Ui.List.Table;

                    const listProps = {
                        ref: ref => this.apiTokensList = ref,
                        api: '/entities/webiny/api-tokens',
                        fields: '*,createdOn',
                        searchFields: 'owner,token',
                        connectToRouter: true,
                        perPage: 100
                    };

                    let systemApiToken = null;
                    if (this.state.apiToken) {
                        systemApiToken = (
                            <Ui.Button type="secondary" align="right" onClick={() => this.systemApiToken.show()}>
                                <Ui.Icon icon="fa-key"/>
                                System API token
                            </Ui.Button>
                        );
                    }

                    return (
                        <Ui.ViewSwitcher>
                            <Ui.ViewSwitcher.View view="tokensListView" defaultView>
                                {showView => (
                                    <Ui.View.List>
                                        <Ui.View.Header
                                            title="ACL - API Tokens"
                                            description="If you want to grant access to your API to 3rd party clients, create an API token for them.">
                                            <Ui.Button
                                                type="primary"
                                                align="right"
                                                onClick={showView('tokenModalView')}
                                                icon="icon-plus-circled"
                                                label="Create new token"/>
                                            {systemApiToken}
                                            <SystemApiTokenModal
                                                ref={ref => this.systemApiToken = ref}
                                                token={this.state.apiToken}
                                                createToken={showView('tokenModalView')}/>
                                        </Ui.View.Header>
                                        <Ui.View.Body>
                                            <Ui.List {...listProps}>
                                                <Ui.List.FormFilters>
                                                    {(applyFilters) => (
                                                        <Ui.Input
                                                            placeholder="Search by owner or token"
                                                            name="_searchQuery"
                                                            onEnter={applyFilters()}/>
                                                    )}
                                                </Ui.List.FormFilters>
                                                <Table>
                                                    <Table.Row>
                                                        <Table.Field name="token" align="left" label="Token">
                                                            {data => (
                                                                <span>
                                                                    <strong>{data.token}</strong><br/>
                                                                    {data.description}
                                                            </span>
                                                            )}
                                                        </Table.Field>
                                                        <Table.Field name="owner" align="left" label="Owner" sort="owner"/>
                                                        <Table.TimeAgoField
                                                            name="lastActivity"
                                                            align="center"
                                                            label="Last activity"
                                                            sort="lastActivity"/>
                                                        <Table.Field name="requests" align="center" label="Total Requests" sort="requests">
                                                            {data => (
                                                                <Ui.Link route="ApiLogs.List" params={{token: data.id}}>
                                                                    {data.requests}
                                                                </Ui.Link>
                                                            )}
                                                        </Table.Field>
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
                                                                        <span>
                                                                            This will disable API token and prevent it's bearer from using your API!
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
                                                </Table>
                                                <Ui.List.Pagination/>
                                            </Ui.List>
                                        </Ui.View.Body>
                                    </Ui.View.List>
                                )}
                            </Ui.ViewSwitcher.View>
                            <Ui.ViewSwitcher.View view="tokenModalView" modal>
                                {(showView, data) => (
                                    <ApiTokenModal
                                        {...{showView, data}}
                                        refreshTokens={() => this.apiTokensList.loadData()}/>
                                )}
                            </Ui.ViewSwitcher.View>
                        </Ui.ViewSwitcher>
                    );
                }}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default ApiTokensList;