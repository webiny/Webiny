/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class UserGroupsForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            entities: [],
            entityFilter: ''
        };
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint('/services/core/entities', {query: {withDetails: true}}).get().then(apiResponse => {
            this.setState({entities: apiResponse.getData()});
        });
    }
}

UserGroupsForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/core/user-groups',
            fields: 'id,name,tag,permissions',
            connectToRouter: true,
            onSubmitSuccess: 'UserGroups.List',
            onCancel: 'UserGroups.List',
            onSuccessMessage: (record) => {
                return <span>User group <strong>{record.name}</strong> saved!</span>;
            }
        };

        return (
            <Ui.Form.Container ui="notificationForm" {...formProps}>
                {(model, container) => {
                    const entities = [];
                     this.state.entities.map(entity => {
                        if(entity.class.toLowerCase().indexOf(this.state.entityFilter.toLowerCase()) === -1){
                            return;
                        }

                        const entityPermissions = {
                            id: entity.class,
                            entity: entity.class,
                            create: _.get(model, 'permissions.entities.' + entity.class + '.create', false),
                            read: _.get(model, 'permissions.entities.' + entity.class + '.read', false),
                            update: _.get(model, 'permissions.entities.' + entity.class + '.update', false),
                            delete: _.get(model, 'permissions.entities.' + entity.class + '.delete', false),
                            custom: false
                        };

                        if (entity.methods.length) {
                            entityPermissions.custom = entity.methods.map(m => {
                                const exposed = _.get(model, 'permissions.entities.' + entity.class + '.' + m.key, false);
                                return _.assign({}, m, {exposed});
                            });
                        }

                        entities.push(entityPermissions);
                    });

                    const actions = {
                        update: (id, attrs) => {
                            const permissions = _.get(model.permissions.entities, id, {});
                            const parts = _.toPairs(attrs)[0];
                            _.set(permissions, parts[0], parts[1]);
                            _.set(model.permissions.entities, id, permissions);
                            container.setModel(model);
                        }
                    };

                    return (
                        <Ui.Panel.Panel>
                            <Ui.Panel.Header>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        User Group
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Button type="primary" align="right" onClick={container.submit}>Save Changes</Ui.Button>
                                        <Ui.Button type="default" align="right" onClick={container.cancel}>Go Back</Ui.Button>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Panel.Header>
                            <Ui.Panel.Body>
                                <Ui.Form.Fieldset title="General"/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Input label="Tag" name="tag" readOnly={true}/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Tabs.Tabs>
                                            <Ui.Tabs.Tab label="Entities">
                                                <Ui.Input placeholder="Filter entities" valueLink={this.bindTo('entityFilter')} delay={0}/>
                                                <Table.Table data={entities} actions={actions}>
                                                    <Table.Row>
                                                        <Table.RowDetailsField hide={data => !data.custom}/>
                                                        <Table.Field name="entity" label="Entity"/>
                                                        <Table.ToggleField name="create" label="Create" align="center"/>
                                                        <Table.ToggleField name="read" label="Read" align="center"/>
                                                        <Table.ToggleField name="update" label="Update" align="center"/>
                                                        <Table.ToggleField name="delete" label="Delete" align="center"/>
                                                    </Table.Row>
                                                    <Table.RowDetails>
                                                        {data => {
                                                            return (
                                                                <div style={{padding: '10px 40px 0px 0px'}}>
                                                                    {data.custom.map(m => {
                                                                        return (
                                                                            <Ui.Grid.Row key={m.key}>
                                                                                <Ui.Grid.Col all={9} xsOffset={1}>
                                                                                    <strong>{m.httpMethod.toUpperCase()}</strong> {m.url}
                                                                                </Ui.Grid.Col>
                                                                                <Ui.Grid.Col all={2}>
                                                                                    <Ui.SwitchButton value={m.exposed} onChange={v => {
                                                                                actions.update(data.id, {[m.key]: v});
                                                                            }}/>
                                                                                </Ui.Grid.Col>
                                                                            </Ui.Grid.Row>
                                                                        );
                                                                    })}
                                                                </div>
                                                            );
                                                        }}
                                                    </Table.RowDetails>
                                                </Table.Table>
                                            </Ui.Tabs.Tab>
                                            <Ui.Tabs.Tab label="Services">
                                            </Ui.Tabs.Tab>
                                        </Ui.Tabs.Tabs>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Panel.Body>
                        </Ui.Panel.Panel>
                    );
                }}
            </Ui.Form.Container>
        );
    }
};

export default UserGroupsForm;
