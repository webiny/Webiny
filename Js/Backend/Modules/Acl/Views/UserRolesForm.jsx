/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class Form extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.state = {
            permissions: []
        };

        this.bindMethods();
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint('/entities/core/user-permissions').get('/', {_perPage: 1000, _sort: 'name'}).then(apiResponse => {
            this.setState({permissions: apiResponse.getData('list')});
        });
    }

    renderPermission(permission, model, container) {
        const checkedIndex = _.findIndex(model.permissions, {id: permission.id});
        return (
            <tr key={permission.id}>
                <td className="text-left">
                    <Ui.SwitchButton value={checkedIndex > -1} onChange={enabled => {
                        model.permissions = _.get(model, 'permissions', []);
                        if(enabled){
                            model.permissions.push(permission);
                        } else {
                            model.permissions.splice(checkedIndex, 1);
                        }
                        container.setModel(model);
                    }}/>
                </td>
                <td className="text-left"><strong>{permission.name}</strong><br/>{permission.slug}</td>
                <td className="text-left">{permission.description || '-'}</td>
            </tr>
        );
    }
}

Form.defaultProps = {
    renderer() {
        const containerProps = {
            api: '/entities/core/user-roles',
            fields: '*,permissions',
            connectToRouter: true,
            onSubmitSuccess: 'UserRoles.List',
            onCancel: 'UserRoles.List',
            onSuccessMessage: (record) => {
                return <span>Role <strong>{record.name}</strong> was saved successfully!</span>;
            }
        };

        return (
            <Ui.Form.Container ui="myForm" {...containerProps}>
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header title={model.id ? 'ACL - Edit Role' : 'ACL - Create Role'}/>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs.Tabs size="large">
                                <Ui.Tabs.Tab label="General" icon="fa-unlock-alt">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Name" name="name" validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Slug" name="slug" validate="required"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Input label="Description" name="description" validate="required"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <table className="table table-simple">
                                        <thead>
                                        <tr>
                                            <th className="text-left" style={{width: 140}}></th>
                                            <th className="text-left">Permission</th>
                                            <th className="text-left">Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.permissions.map(p => this.renderPermission(p, model, container))}
                                        </tbody>
                                    </table>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button type="default" onClick={container.cancel} label="Go back"/>
                            <Ui.Button type="primary" onClick={container.submit} label="Save role" align="right"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form.Container>
        );
    }
};

export default Form;
