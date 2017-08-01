import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import moment from 'moment';

class ApiLogsList extends Webiny.Ui.View {
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

        new Webiny.Api.Endpoint('/entities/webiny/api-tokens').get(Webiny.Router.getParams('token')).then(apiResponse => {
            this.setState({token: apiResponse.getData('entity')});
        });
    }
}

ApiLogsList.defaultProps = {
    renderer() {
        const tokenId = _.get(this.state.token, 'id');
        const listProps = {
            api: tokenId === 'system' ? '/services/webiny/acl/logs' : '/entities/webiny/api-logs',
            fields: '*,createdOn,user[id,firstName,lastName,email],token[id,description,owner]',
            query: {
                token: tokenId === 'system' ? null : Webiny.Router.getParams('token'),
                _sort: '-createdOn'
            },
            searchFields: 'request.method,request.url',
            layout: null,
            connectToRouter: true
        };

        const {Ui} = this.props;

        return (
            <Ui.View.List>
                <Ui.View.Header
                    title={this.state.token ? `ACL - API Logs: ${this.state.token.description}` : 'ACL - API Logs'}
                    description="Here you can view all API request logs."/>
                <Ui.View.Body>
                    <Ui.List {...listProps}>
                        {data => {
                            return (
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.List.FormFilters>
                                            {(apply) => (
                                                <Ui.Grid.Row>
                                                    <Ui.Grid.Col all={3}>
                                                        <Ui.Input
                                                            name="_searchQuery"
                                                            placeholder="Search by method or URL"
                                                            onEnter={apply()}/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}>
                                                        <Ui.Select
                                                            api="/entities/webiny/api-logs/methods"
                                                            name="method"
                                                            placeholder="Filter by HTTP method"
                                                            allowClear={true}
                                                            onChange={apply()}/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}>
                                                        <Ui.Select
                                                            api="/entities/webiny/api-tokens"
                                                            optionRenderer={item => `${item.data.description} (${item.data.owner})`}
                                                            selectedRenderer={item => `${item.data.description} (${item.data.owner})`}
                                                            name="token"
                                                            placeholder="Filter by token"
                                                            allowClear={true}
                                                            onChange={apply()}/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3}>
                                                        <Ui.Search
                                                            api="/entities/webiny/users"
                                                            fields="id,firstName,lastName,email"
                                                            searchFields="firstName,lastName,email"
                                                            optionRenderer={(item) => `${item.firstName} ${item.lastName} (${item.email})`}
                                                            selectedRenderer={(item) => `${item.firstName} ${item.lastName} (${item.email})`}
                                                            name="createdBy"
                                                            placeholder="Filter by user"
                                                            onChange={apply()}/>
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
                                                const user = row.user;
                                                return (
                                                    <Ui.ExpandableList.Row key={row.id}>
                                                        <Ui.ExpandableList.Field all={1} name="Method" className="text-center">
                                                            <Ui.Label type="info" inline>{row.method}</Ui.Label>
                                                        </Ui.ExpandableList.Field>
                                                        <Ui.ExpandableList.Field all={8} name="URL" className="text-left">
                                                            {row.request.url}<br/>
                                                            <Ui.Logic.Show if={() => user}>
                                                                <Ui.Label type="info" inline>
                                                                    {user.firstName} {user.lastName} ({user.email})
                                                                </Ui.Label>
                                                            </Ui.Logic.Show>
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
        );
    }
};

export default Webiny.createComponent(ApiLogsList, {
    modulesProp: 'Ui',
    modules: ['View', 'Link', 'List', 'Grid', 'Input', 'ExpandableList', 'Label', 'CodeHighlight', 'Select', 'Search', 'Logic']
});