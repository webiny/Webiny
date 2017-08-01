import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import moment from 'moment';

class ApiLogsList extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            token: null,
            tokens: []
        };

        this.systemToken = {
            id: 'system',
            description: 'System Token'
        };
    }

    componentWillMount() {
        super.componentWillMount();
        const token = Webiny.Router.getParams('token');
        if (token === 'system') {
            return this.setState({
                token: this.systemToken
            });
        }

        if (token !== 'system') {
            new Webiny.Api.Endpoint('/entities/webiny/api-tokens').get(Webiny.Router.getParams('token')).then(apiResponse => {
                this.setState({token: apiResponse.getData('entity')});
            });
        }

        this.prepareTokenOptions();
    }

    prepareTokenOptions() {
        const options = [];
        return new Webiny.Api.Endpoint('/services/webiny/acl').get('token').then(apiResponse => {
            if (!apiResponse.isError()) {
                options.push(this.systemToken);
            }

            return new Webiny.Api.Endpoint('/entities/webiny/api-tokens').get('/', {_fields: 'id,owner,description'}).then(apiResponse => {
                if (!apiResponse.isError()) {
                    apiResponse.getData('list').map(token => options.push(token));
                }
                this.setState({tokens: options});
            });
        });
    }

    renderUrlField(row) {
        let {user, token} = row;
        let userLabel = null;
        let tokenLabel = null;

        const {Ui} = this.props;

        if (!_.isNil(user)) {
            userLabel = (
                <Ui.Label type="default" inline>
                    {user.firstName} {user.lastName} ({user.email})
                </Ui.Label>
            );
        }

        if (!_.isNil(token)) {
            if (token === 'system') {
                tokenLabel = (
                    <Ui.Label type="error" inline>System token</Ui.Label>
                );
            } else {
                tokenLabel = (
                    <Ui.Label type="success" inline>
                        {token.description} ({token.owner})
                    </Ui.Label>
                );
            }
        }

        return (
            <field>
                {row.request.url}<br/>
                <Ui.Label type="info" inline>{row.method}</Ui.Label>
                {userLabel}
                {tokenLabel}
            </field>
        );
    }

    renderTokenOption(item) {
        let option = item.data.description;
        if (item.data.owner) {
            option += ` (${item.data.owner})`;
        }
        return option;
    }
}

ApiLogsList.defaultProps = {
    renderer() {
        const listProps = {
            api: '/entities/webiny/api-logs',
            fields: '*,createdOn,user[id,firstName,lastName,email],token[id,description,owner]',
            query: {
                token: Webiny.Router.getParams('token'),
                _sort: '-createdOn'
            },
            searchFields: 'request.method,request.url',
            layout: null,
            connectToRouter: true
        };

        const {Ui} = this.props;
        const isSystemToken = this.state.token === 'system';

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
                                                    <Ui.Grid.Col all={3} renderIf={!isSystemToken}>
                                                        <Ui.Select
                                                            options={this.state.tokens}
                                                            optionRenderer={this.renderTokenOption}
                                                            selectedRenderer={this.renderTokenOption}
                                                            name="token"
                                                            placeholder="Filter by token"
                                                            allowClear={true}
                                                            onChange={apply()}/>
                                                    </Ui.Grid.Col>
                                                    <Ui.Grid.Col all={3} renderIf={!isSystemToken}>
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
                                                return (
                                                    <Ui.ExpandableList.Row key={row.id}>
                                                        <Ui.ExpandableList.Field all={9} name="URL" className="text-left">
                                                            {this.renderUrlField(row)}
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