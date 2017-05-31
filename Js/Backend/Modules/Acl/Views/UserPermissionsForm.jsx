/* eslint-disable */
import Webiny from 'Webiny';

class UserPermissionsForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            entities: [],
            services: [],
            entityFilter: '',
            serviceFilter: ''
        };

        this.crud = {
            list: '/.get',
            get: '{id}.get',
            create: '/.post',
            update: '{id}.patch',
            delete: '{id}.delete'
        };

        this.bindMethods('renderService');
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint('/services/webiny/entities', {query: {withDetails: true, crudMethods: true}}).get().then(apiResponse => {
            this.setState({entities: apiResponse.getData()});
            return new Webiny.Api.Endpoint('/services/webiny/services', {query: {withDetails: true}}).get().then(apiResponse => {
                this.setState({services: apiResponse.getData()});
            });
        });
    }

    renderService(service, model, container, Ui) {
        return (
            <div key={service.id}>
                <h5><strong>{service.name}</strong></h5>
                <table className="table table-simple no-hover">
                    <thead>
                    <tr>
                        <th className="text-left" style={{width: 140}}/>
                        <th className="text-left">Method</th>
                    </tr>
                    </thead>
                    <tbody>
                    {service.methods.map(m => {
                        return (
                            <tr key={m.key}>
                                <td className="text-left">
                                    <Ui.Switch value={m.exposed} onChange={enabled => {
                                    const permissions = _.get(model, 'permissions.services.' + service.name, {});
                                    _.set(permissions, m.key, enabled);
                                    _.set(model, 'permissions.services.' + service.name, permissions);
                                    container.setModel(model);
                                }}/>
                                </td>
                                <td className="text-left">
                                    {m.description || 'No description available'}<br/>
                                    <Ui.Label type="info"><strong>{m.method.toUpperCase()}</strong></Ui.Label>
                                    <a>{m.url}</a>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }

    renderView(Ui) {
        const formProps = {
            api: '/entities/webiny/user-permissions',
            fields: 'id,name,slug,description,permissions',
            connectToRouter: true,
            onSubmitSuccess: 'UserPermissions.List',
            onCancel: 'UserPermissions.List',
            onSuccessMessage: (record) => {
                return <span>Permission <strong>{record.name}</strong> was saved!</span>;
            }
        };

        return (
            <Ui.Form {...formProps}>
                {(model, container) => {
                    const entities = [];
                    const services = [];
                    this.state.entities.map(entity => {
                        if (entity.class.toLowerCase().indexOf(this.state.entityFilter.toLowerCase()) === -1) {
                            return;
                        }

                        const crudCreate = _.find(entity.methods, {key: this.crud.create});
                        const crudRead = _.find(entity.methods, {key: this.crud.get}) || _.find(entity.methods, {key: this.crud.list});
                        const crudUpdate = _.find(entity.methods, {key: this.crud.update});
                        const crudDelete = _.find(entity.methods, {key: this.crud.delete});

                        const entityPermissions = {
                            id: entity.class,
                            name: entity.class,
                            crudCreate: _.get(model, 'permissions.entities.' + entity.class + '.crudCreate', false),
                            crudRead: _.get(model, 'permissions.entities.' + entity.class + '.crudRead', false),
                            crudUpdate: _.get(model, 'permissions.entities.' + entity.class + '.crudUpdate', false),
                            crudDelete: _.get(model, 'permissions.entities.' + entity.class + '.crudDelete', false),
                            hasCrudCreate: crudCreate && !crudCreate.custom,
                            hasCrudRead: crudRead && !crudRead.custom,
                            hasCrudUpdate: crudUpdate && !crudUpdate.custom,
                            hasCrudDelete: crudDelete && !crudDelete.custom,
                            custom: false
                        };

                        if (entity.methods.length) {
                            entityPermissions.custom = [];
                            _.each(entity.methods, (m => {
                                if (!m.custom) {
                                    return;
                                }
                                const exposed = _.get(model, 'permissions.entities.' + entity.class + '.' + m.key, false);
                                entityPermissions.custom.push(_.assign({}, m, {exposed}));
                            }));

                            if (entityPermissions.custom.length === 0) {
                                entityPermissions.custom = false;
                            }
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

                    const Table = Ui.List.Table;
                    return (
                        <Ui.View.Form>
                            <Ui.View.Header title={model.id ? 'ACL - Edit permission' : 'ACL - Create permission'}/>
                            <Ui.View.Body>
                                <Ui.Section title="General"/>
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
                                        <Ui.Tabs>
                                            <Ui.Tabs.Tab label="Entities">
                                                <Ui.Input placeholder="Filter entities" {...this.bindTo('entityFilter')} delay={0}/>
                                                <Table data={entities} actions={entityActions} className="no-hover">
                                                    <Table.Row>
                                                        <Table.RowDetailsField hide={data => !data.custom}/>
                                                        <Table.Field name="name" label="Entity"/>
                                                        <Table.ToggleField
                                                            disabled={r => !r.hasCrudCreate}
                                                            name="crudCreate"
                                                            label="Create"
                                                            align="center"/>
                                                        <Table.ToggleField
                                                            disabled={r => !r.hasCrudRead}
                                                            name="crudRead"
                                                            label="Read"
                                                            align="center"/>
                                                        <Table.ToggleField
                                                            disabled={r => !r.hasCrudUpdate}
                                                            name="crudUpdate"
                                                            label="Update"
                                                            align="center"/>
                                                        <Table.ToggleField
                                                            disabled={r => !r.hasCrudDelete}
                                                            name="crudDelete"
                                                            label="Delete"
                                                            align="center"/>
                                                    </Table.Row>
                                                    <Table.RowDetails>
                                                        {data => {
                                                            return (
                                                                <div style={{padding: '10px 40px 0px 0px'}}>
                                                                    <table className="table table-simple no-hover">
                                                                        <thead>
                                                                        <tr>
                                                                            <th className="text-left" style={{width: 140}}/>
                                                                            <th className="text-left">Method</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {data.custom.map(m => {
                                                                            return (
                                                                                <tr key={m.key}>
                                                                                    <td className="text-left">
                                                                                        <Ui.Switch value={m.exposed} onChange={enabled => {
                                                                                            entityActions.update(data.id, {[m.key]: enabled});
                                                                                        }}/>
                                                                                    </td>
                                                                                    <td className="text-left">
                                                                                        {m.description || 'No description available'}<br/>
                                                                                        <Ui.Label
                                                                                            type="info"><strong>{m.method.toUpperCase()}</strong></Ui.Label>
                                                                                        <a>{m.url}</a>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            );
                                                        }}
                                                    </Table.RowDetails>
                                                </Table>
                                            </Ui.Tabs.Tab>
                                            <Ui.Tabs.Tab label="Services">
                                                <Ui.Input placeholder="Filter services" {...this.bindTo('serviceFilter')} delay={0}/>
                                                {services.map(service => this.renderService(service, model, container, Ui))}
                                            </Ui.Tabs.Tab>
                                        </Ui.Tabs>
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
            </Ui.Form>
        );
    }
}

UserPermissionsForm.defaultProps = {
    renderer() {
        return (
            <Webiny.Ui.LazyLoad modules={['Form', 'Section', 'View', 'Grid', 'Tabs', 'Input', 'List', 'Label', 'Button', 'Switch']}>
                {(Ui) => this.renderView(Ui)}
            </Webiny.Ui.LazyLoad>
        );

    }
};

export default UserPermissionsForm;
