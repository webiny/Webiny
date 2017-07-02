/* eslint-disable */
import Webiny from 'Webiny';
import EntityPermissions from './EntityPermissionsForm/EntityPermissions';
import ServicePermissions from './EntityPermissionsForm/ServicePermissions';

class UserPermissionsForm extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            entities: [],
            services: []
        };

        this.bindMethods('renderService');
    }

    renderService(service, model, form, Ui) {
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
                                        form.setModel(model);
                                    }}/>
                                </td>
                                <td className="text-left">
                                    {m.name ? <strong>{m.name}<br/></strong> : null}
                                    <span>{m.description || 'No description available' }</span>
                                    <br/>
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
            defaultModel: {permissions: {entities: {}, services: {}}},
            onSuccessMessage: (record) => {
                return <span>Permission <strong>{record.name}</strong> was saved!</span>;
            }
        };

        const newUserPermission = !Webiny.Router.getParams('id');

        return (
            <Ui.Form {...formProps}>
                {(model, form) => {
                    const entities = _.get(model, 'permissions.entities');
                    const services = _.get(model, 'permissions.services');

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
                                                {(newUserPermission || model.id) && (
                                                    <EntityPermissions
                                                        model={model}
                                                        permissions={entities}
                                                        onTogglePermission={(entity, method) => {
                                                            const key = `permissions.entities.${entity}`;
                                                            let permissions = _.get(model, key, {});
                                                            if (_.isArray(permissions)) {
                                                                permissions = {};
                                                            }

                                                            _.set(permissions, method, !_.get(permissions, method));
                                                            form.setModel(key, permissions);
                                                        }}
                                                        onAddEntity={entity => {
                                                            let entities = _.clone(model.permissions.entities);
                                                            if (_.isArray(entities)) {
                                                                entities = {};
                                                            }
                                                            entities[entity.class] = {};
                                                            form.setModel('permissions.entities', entities);
                                                        }}
                                                        onRemoveEntity={entity => {
                                                            const entities = _.clone(model.permissions.entities);
                                                            delete entities[entity.class];
                                                            form.setModel('permissions.entities', entities);
                                                        }}/>
                                                )}
                                            </Ui.Tabs.Tab>
                                            <Ui.Tabs.Tab label="Services">
                                                {(newUserPermission || model.id) && (
                                                    <ServicePermissions
                                                        model={model}
                                                        permissions={services}
                                                        onTogglePermission={(service, method) => {
                                                            const key = `permissions.services.${service}`;
                                                            let permissions = _.get(model, key, {});
                                                            if (_.isArray(permissions)) {
                                                                permissions = {};
                                                            }

                                                            _.set(permissions, method, !_.get(permissions, method));
                                                            form.setModel(key, permissions);
                                                        }}
                                                        onAddService={service => {
                                                            let services = _.clone(model.permissions.services);
                                                            if (_.isArray(services)) {
                                                                services = {};
                                                            }

                                                            services[service.class] = {};
                                                            form.setModel('permissions.services', services);
                                                        }}
                                                        onRemoveService={service => {
                                                            const services = _.clone(model.permissions.services);
                                                            delete services[service.class];
                                                            form.setModel('permissions.services', services);
                                                        }}/>
                                                )}
                                            </Ui.Tabs.Tab>
                                        </Ui.Tabs>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.View.Body>
                            <Ui.View.Footer>
                                <Ui.Button type="default" onClick={form.cancel} label="Go back"/>
                                <Ui.Button type="primary" onClick={form.submit} label="Save permission" align="right"/>
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
            <Webiny.Ui.LazyLoad
                modules={['Form', 'Section', 'View', 'Grid', 'Tabs', 'Input', 'Label', 'Button', 'Switch']}>
                {(Ui) => this.renderView(Ui)}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default UserPermissionsForm;
