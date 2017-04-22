import Webiny from 'Webiny';
import moment from 'moment';

class ApiTokensLogs extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            token: null
        };
    }

    componentWillMount() {
        super.componentWillMount();
        const token = Webiny.Router.getParams('token');
        if (token === 'system') {
            return this.setState({
                token: {
                    id: 'system',
                    description: 'System Token'
                }
            });
        }

        new Webiny.Api.Endpoint('/entities/core/api-tokens').get(Webiny.Router.getParams('token')).then(apiResponse => {
            this.setState({token: apiResponse.getData()});
        });
    }
}

ApiTokensLogs.defaultProps = {
    renderer() {
        const tokenId = _.get(this.state.token, 'id');
        const listProps = {
            ui: 'apiTokenList',
            api: tokenId === 'system' ? '/services/core/acl/token-logs' : '/entities/core/api-token-logs',
            fields: '*,createdOn',
            query: {
                token: tokenId === 'system' ? null : Webiny.Router.getParams('token'),
                _sort: '-createdOn'
            },
            searchFields: 'request.method,request.url',
            layout: null
        };

        return (
            <Webiny.Ui.LazyLoad modules={['View', 'Link', 'List', 'Grid', 'Input', 'ExpandableList', 'Label', 'CodeHighlight']}>
                {(Ui) => (
                    <Ui.View.List>
                        <Ui.View.Header
                            title={this.state.token ? `ACL - API Token Logs: ${this.state.token.description}` : 'ACL - API Token Logs'}
                            description={<span>Here you can view all request made by an API token.</span>}>
                            <Ui.Link type="default" align="right" route="ApiTokens.List">Back to API tokens</Ui.Link>
                        </Ui.View.Header>
                        <Ui.View.Body>
                            <Ui.List {...listProps}>
                                {data => {
                                    return (
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.List.FormFilters>
                                                    {(apply) => (
                                                        <Ui.Grid.Row>
                                                            <Ui.Grid.Col all={12}>
                                                                <Ui.Input
                                                                    name="_searchQuery"
                                                                    placeholder="Search by method or URL"
                                                                    onEnter={apply()}/>
                                                            </Ui.Grid.Col>
                                                        </Ui.Grid.Row>
                                                    )}
                                                </Ui.List.FormFilters>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.List.Loader/>
                                                <Ui.List.Table.Empty renderIf={!data.length}/>
                                                <Ui.ExpandableList>
                                                    {data.map(row => {
                                                        return (
                                                            <Ui.ExpandableList.Row key={row.id}>
                                                                <Ui.ExpandableList.Field all={1} name="Method" className="text-center">
                                                                    <Ui.Label type="info" inline>{row.method}</Ui.Label>
                                                                </Ui.ExpandableList.Field>
                                                                <Ui.ExpandableList.Field all={8} name="URL" className="text-left">
                                                                    {row.request.url}
                                                                </Ui.ExpandableList.Field>
                                                                <Ui.ExpandableList.Field all={3} name="Created On" className="text-center">
                                                                    <span>{moment(row.createdOn).fromNow()}<br/>{row.createdOn}</span>
                                                                </Ui.ExpandableList.Field>
                                                                <Ui.ExpandableList.RowDetailsList title={row.request.url}>
                                                                    <Ui.CodeHighlight language="json">
                                                                        {JSON.stringify(row.request, null, 2)}
                                                                    </Ui.CodeHighlight>
                                                                </Ui.ExpandableList.RowDetailsList>
                                                            </Ui.ExpandableList.Row>
                                                        );
                                                    })}
                                                </Ui.ExpandableList>
                                            </Ui.Grid.Col>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.List.Pagination/>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    );
                                }}
                            </Ui.List>
                        </Ui.View.Body>
                    </Ui.View.List>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default ApiTokensLogs;