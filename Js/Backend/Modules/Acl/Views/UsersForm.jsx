/* eslint-disable */
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const Table = Ui.List.Table;

class Form extends Webiny.Ui.View {
    constructor(props){
        super(props);

        this.state = {
            roles: []
        };

        this.bindMethods();
    }

    componentWillMount() {
        super.componentWillMount();
        new Webiny.Api.Endpoint('/entities/core/user-roles').get('/', {_perPage: 1000, _sort: 'name'}).then(apiResponse => {
            this.setState({roles: _.filter(apiResponse.getData('list'), r => r.slug !== 'public')});
        });
    }

    renderRole(role, model, container) {
        const checkedIndex = _.findIndex(model.roles, {id: role.id});
        model.roles = model.roles || [];
        return (
            <tr key={role.id}>
                <td className="text-left">
                    <Ui.SwitchButton value={checkedIndex > -1} onChange={enabled => {
                        if(enabled){
                            model.roles.push(role);
                        } else {
                            model.roles.splice(checkedIndex, 1);
                        }
                        container.setModel(model);
                    }}/>
                </td>
                <td className="text-left"><strong>{role.name}</strong><br/>{role.slug}</td>
                <td className="text-left">{role.description || '-'}</td>
            </tr>
        );
    }
}

Form.defaultProps = {
    renderer() {
        const containerProps = {
            api: '/entities/core/users',
            fields: 'id,firstName,lastName,email,roles,enabled',
            connectToRouter: true,
            onSubmitSuccess: 'Users.List',
            onCancel: 'Users.List',
            onSuccessMessage: (record) => {
                return <span>User <strong>{record.firstName}</strong> was saved successfully!</span>;
            }
        };

        return (
            <Ui.Form ui="myForm" {...containerProps}>
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header title={model.id ? 'ACL - Edit User' : 'ACL - Create User'}/>
                        <Ui.Form.Error message="Something went wrong during save"/>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs size="large">
                                <Ui.Tabs.Tab label="General" icon="fa-user">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="First name" name="firstName" validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Last name" name="lastName" validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Email" name="email" description="Your email" validate="required,email"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Switch label="Enabled" name="enabled"/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                    <table className="table table-simple">
                                        <thead>
                                        <tr>
                                            <th className="text-left" style={{width: 140}}></th>
                                            <th className="text-left">Role</th>
                                            <th className="text-left">Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.roles.map(r => this.renderRole(r, model, container))}
                                        </tbody>
                                    </table>
                                </Ui.Tabs.Tab>
                            </Ui.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer>
                            <Ui.Button type="default" onClick={container.cancel} label="Go back"/>
                            <Ui.Button type="primary" onClick={container.submit} label="Save user" align="right"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Form>
        );
    }
};

export default Form;
