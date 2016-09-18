/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class UserPermissionsForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            entities: [],
            services: [],
            entityFilter: '',
            serviceFilter: ''
        };

        this.bindMethods('renderService');
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint('/services/core/entities', {query: {withDetails: true}}).get().then(apiResponse => {
            this.setState({entities: apiResponse.getData()});
        });

        new Webiny.Api.Endpoint('/services/core/services', {query: {withDetails: true}}).get().then(apiResponse => {
            this.setState({services: apiResponse.getData()});
        });
    }

    renderService(service, model, container) {
        return (
            <div key={service.id}>
                <Ui.Form.Fieldset title={service.name}/>
                {service.methods.map(m => {
                    return (
                        <Ui.Grid.Row key={m.key}>
                            <Ui.Grid.Col all={2}>
                                <Ui.SwitchButton value={m.exposed} onChange={v => {
                                    const permissions = _.get(model, 'permissions.services.' + service.name, {});
                                    _.set(permissions, m.key, v);
                                    _.set(model, 'permissions.services.' + service.name, permissions);
                                    container.setModel(model);
                                }}/>
                            </Ui.Grid.Col>
                            <Ui.Grid.Col all={10}>
                                <a><strong>{m.method.toUpperCase()}</strong> {m.url}</a>
                                <br/><span>{m.description}</span>
                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    );
                })}
            </div>
        );
    }
}

UserPermissionsForm.defaultProps = {
    renderer() {
        const formProps = {
            api: '/entities/core/user-permissions',
            fields: 'id,name,slug,description,permissions',
            connectToRouter: true,
            onSubmitSuccess: 'UserPermissions.List',
            onCancel: 'UserPermissions.List',
            onSuccessMessage: (record) => {
                return <span>Permission <strong>{record.name}</strong> was saved!</span>;
            }
        };

        return (

            <Ui.Form.Container {...formProps}>
                {(model, container) => {
                    const entities = [];
                    const services = [];
                    this.state.entities.map(entity => {
                        if (entity.class.toLowerCase().indexOf(this.state.entityFilter.toLowerCase()) === -1) {
                            return;
                        }

                        const entityPermissions = {
                            id: entity.class,
                            name: entity.class,
                            crudCreate: _.get(model, 'permissions.entities.' + entity.class + '.crudCreate', false),
                            crudRead: _.get(model, 'permissions.entities.' + entity.class + '.crudRead', false),
                            crudUpdate: _.get(model, 'permissions.entities.' + entity.class + '.crudUpdate', false),
                            crudDelete: _.get(model, 'permissions.entities.' + entity.class + '.crudDelete', false),
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

                    this.state.services.map(service => {
                        if (!service.authorization || service.class.toLowerCase().indexOf(this.state.serviceFilter.toLowerCase()) === -1) {
                            return;
                        }

                        const servicePermissions = {
                            id: service.class,
                            name: service.class,
                            methods: service.methods.map(m => {
                                const exposed = _.get(model, 'permissions.services.' + service.class + '.' + m.key, false);
                                return _.assign({}, m, {exposed});
                            })
                        };

                        services.push(servicePermissions);
                    });


                    const entityActions = {
                        update: (id, attrs) => {
                            const permissions = _.get(model, 'permissions.entities.' + id, {});
                            const parts = _.toPairs(attrs)[0];
                            _.set(permissions, parts[0], parts[1]);
                            _.set(model, 'permissions.entities.' + id, permissions);
                            container.setModel(model);
                        }
                    };

                    return (
                        <Ui.View.Form>
                            <Ui.View.Header title={model.id ? 'ACL - Edit permission' : 'ACL - Create permission'}/>
                            <Ui.View.Body>
                                <Ui.Form.Fieldset title="General"/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Input label="Name" name="name" validate="required"/>
                                    </Ui.Grid.Col>
                                    <Ui.Grid.Col all={6}>
                                        <Ui.Input label="Slug" name="slug"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Description" name="description" validate="required"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Tabs.Tabs>
                                            <Ui.Tabs.Tab label="Entities">
                                                <Ui.Input placeholder="Filter entities" valueLink={this.bindTo('entityFilter')} delay={0}/>
                                                <Table.Table data={entities} actions={entityActions}>
                                                    <Table.Row>
                                                        <Table.RowDetailsField hide={data => !data.custom}/>
                                                        <Table.Field name="name" label="Entity"/>
                                                        <Table.ToggleField name="crudCreate" label="Create" align="center"/>
                                                        <Table.ToggleField name="crudRead" label="Read" align="center"/>
                                                        <Table.ToggleField name="crudUpdate" label="Update" align="center"/>
                                                        <Table.ToggleField name="crudDelete" label="Delete" align="center"/>
                                                    </Table.Row>
                                                    <Table.RowDetails>
                                                        {data => {
                                                            return (
                                                                <div style={{padding: '10px 40px 0px 0px'}}>
                                                                    {data.custom.map(m => {
                                                                        return (
                                                                            <Ui.Grid.Row key={m.key}>
                                                                                <Ui.Grid.Col all={2}>
                                                                                    <Ui.SwitchButton value={m.exposed} onChange={v => {
                                                                                        entityActions.update(data.id, {[m.key]: v});
                                                                                    }}/>
                                                                                </Ui.Grid.Col>
                                                                                <Ui.Grid.Col all={10}>
                                                                                    <a><strong>{m.method.toUpperCase()}</strong> {m.url}</a>
                                                                                    <br/><span>{m.description}</span>
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
                                                <Ui.Input placeholder="Filter services" valueLink={this.bindTo('serviceFilter')} delay={0}/>
                                                {services.map(service => this.renderService(service, model, container))}
                                            </Ui.Tabs.Tab>
                                        </Ui.Tabs.Tabs>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.View.Body>
                            <Ui.View.Footer>
                                <Ui.Button type="default" onClick={container.cancel} label="Go back"/>
                                <Ui.Button type="primary" onClick={container.submit} label="Save permission" align="right"/>
                            </Ui.View.Footer>
                        </Ui.View.Form>
                    );
                }}
            </Ui.Form.Container>
        );
    }
};

export default UserPermissionsForm;
